import { ArraySettings, Asset, CanvasSetting, CanvasSettingValue, CanvasSettings, Entry, Node, fixSetting, hasSetting } from '../models';
import { Attributes, ICanvasDataProvider, ICanvasParser, ICanvasWalker, ParserSettings, ResolveContext, Resolver } from './models';
import { Url } from './models/models';
import { findResolver } from './models/types';

type IdFixer = (id: string) => string;

export interface DataResolver {
    getAssetByPath(path: string): Promise<Asset | null>;
    getEntryByPath(path: string): Promise<Entry | null>;
    getNodeByPath(path: string): Promise<Node | null>;
}

export interface UrlParser {
    parseUrl(path: string): Url;
    toAbsoluteUrl(url: string): string;
}

type Lookup = Entry | Asset | Node | null;

export class CanvasPreParser implements ICanvasParser<Promise<ICanvasDataProvider>> {
    private friendlyIds = new Map<string, string>();
    private ids = new Map<string, string>();
    private context!: ResolveContext;

    constructor(
        private walker: ICanvasWalker,
        private settings: CanvasSettings,
        private parserSettings: ParserSettings,
        private idFixer: IdFixer,
        private friendlyIdFixer: IdFixer,
        private dataResolver: DataResolver,
        private urlParser: UrlParser
    ) {}

    async parse() {
        this.context = new ResolveContext();
        this.friendlyIds = new Map<string, string>();
        this.ids = new Map<string, string>();

        this.walker.onEnd(() => this.onEnd());
        this.walker.onOpenTag((name, attributes) => this.onOpenTag(name, attributes));
        this.walker.onCloseTag(() => this.onCloseTag());
        this.walker.onText((text) => this.onText(text));

        this.walker.walk();

        const data = this.context.export();
        const keys = Array.from(data.keys());

        const promises: Promise<[string, Lookup]>[] = keys.map((key) => {
            const value = data.get(key);
            const uri = value?.uri;
            let promise: Promise<Entry | Asset | Node | null> = Promise.resolve(null);
            if (uri) {
                switch (value.type) {
                    case 'entry': {
                        promise = this.dataResolver.getEntryByPath(uri);
                        break;
                    }
                    case 'asset': {
                        promise = this.dataResolver.getAssetByPath(uri);
                        break;
                    }
                    case 'node': {
                        promise = this.dataResolver.getNodeByPath(uri);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
            return promise.then((value) => [key, value]);
        });

        const lookupData = await Promise.all(promises);
        const lookup = new Map(lookupData);

        return new CanvasDataProvider(this.settings, this.parserSettings, this.ids, this.friendlyIds, lookup, this.urlParser);
    }

    private onEnd(): void {}

    private onOpenTag(name: string, attributes: Attributes): void {
        if (attributes['id']) {
            this.friendlyIds.set(attributes['id'], this.friendlyIdFixer(attributes['id']));
        }
        if (attributes['data-uuid']) {
            this.ids.set(attributes['data-uuid'], this.idFixer(attributes['data-uuid']));
        }

        const ResolverType = findResolver(name);
        const resolver: Resolver = new ResolverType(name, attributes, this.context);
        resolver.resolve();
    }

    private onCloseTag(): void {}

    private onText(_text: string): void {}
}

class CanvasDataProvider implements ICanvasDataProvider {
    constructor(
        public settings: CanvasSettings,
        public parserSettings: ParserSettings,
        private idLookup: Map<string, string>,
        private friendlyIdLookup: Map<string, string>,
        private dataLookup: Map<string, Lookup>,
        private urlParser: UrlParser
    ) {}

    hasSetting(setting: CanvasSetting): boolean {
        return hasSetting(this.settings, setting);
    }

    fixSetting<TKey extends keyof ArraySettings>(
        key: TKey,
        value: ArraySettings[TKey],
        defaultValue: ArraySettings[TKey]
    ): CanvasSettingValue<ArraySettings[TKey]> {
        return fixSetting(this.settings, key, value, defaultValue);
    }

    findFriendlyId(id: string): string {
        return this.friendlyIdLookup.get(id) || '';
    }

    findId(id: string): string {
        return this.idLookup.get(id) || '';
    }

    getAsset(key: string): Asset {
        const k = ResolveContext.toKey('asset', key);
        return this.dataLookup.get(k) as Asset;
    }

    getImage(key: string): Asset {
        const asset = this.getAsset(key);
        return (asset?.sys?.contentTypeId === 'image' ? asset : undefined) as Asset;
    }

    getEntry(key: string): Entry {
        const k = ResolveContext.toKey('entry', key);
        return this.dataLookup.get(k) as Entry;
    }

    getNode(key: string): Node {
        const k = ResolveContext.toKey('node', key);
        return this.dataLookup.get(k) as Node;
    }

    getAbsoluteUrl(url: string): string {
        return this.urlParser.toAbsoluteUrl(url);
    }

    getUrl(url: string) {
        return this.urlParser.parseUrl(url);
    }
}

export class InlineCanvasDataProvider implements ICanvasDataProvider {
    constructor(public settings: CanvasSettings, public parserSettings: ParserSettings, private urlParser: UrlParser) {}

    hasSetting(setting: CanvasSetting): boolean {
        return hasSetting(this.settings, setting);
    }

    fixSetting<TKey extends keyof ArraySettings>(
        key: TKey,
        value: ArraySettings[TKey],
        defaultValue: ArraySettings[TKey]
    ): CanvasSettingValue<ArraySettings[TKey]> {
        return fixSetting(this.settings, key, value, defaultValue);
    }

    findFriendlyId(id: string): string {
        return id;
    }

    findId(id: string): string {
        return id;
    }

    getAsset(_key: string): Asset {
        return null as any;
    }

    getImage(_key: string): Asset {
        return null as any;
    }

    getEntry(_key: string): Entry {
        return null as any;
    }

    getNode(_key: string): Node {
        return null as any;
    }

    getAbsoluteUrl(url: string): string {
        return this.urlParser.toAbsoluteUrl(url);
    }

    getUrl(url: string) {
        return this.urlParser.parseUrl(url);
    }
}
