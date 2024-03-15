import { ArraySettings, Asset, Block, CanvasSetting, CanvasSettingValue, CanvasSettings, Entry, Node, Project } from '../../models';

export type Attributes = Record<string, string>;

export interface Element {
    appendTo(parent: Element): void;
    append(...items: Block[]): void;
    addText(text: string): void;
    export(): Block[];
}

export type VoidFn = () => void;

// SystemSettings

export type ParserSettings = {
    components: string[];
    project: Project;
    rootUrl: string;
    projectUuid: string;
};

export type OnEnd = () => void;
export type OnOpenTag = (name: string, attributes: Attributes) => void;
export type OnCloseTag = () => void;
export type OnText = (text: string) => void;

export interface ICanvasWalker {
    onEnd(onEnd: OnEnd): void;
    onOpenTag(onOpenTag: OnOpenTag): void;
    onCloseTag(onCloseTag: OnCloseTag): void;
    onText(onText: OnText): void;
    walk(): void;
}

export interface ICanvasParser<T> {
    parse(): T;
}

export interface ICanvasDataProvider {
    settings: CanvasSettings;
    parserSettings: ParserSettings;

    hasSetting(setting: CanvasSetting): boolean;
    fixSetting<TKey extends keyof ArraySettings>(
        key: TKey,
        value: ArraySettings[TKey],
        defaultValue: ArraySettings[TKey]
    ): CanvasSettingValue<ArraySettings[TKey]>;

    findFriendlyId(id: string): string;
    findId(id: string): string;

    getAsset(key: string): Asset;
    getImage(key: string): Asset;
    getEntry(key: string): Entry;
    getNode(key: string): Node;
    getAbsoluteUrl(url: string): string;
    getUrl(url: string): Url;
}

export interface Resolver {
    resolve(): void;
}

export type Url = {
    // origin: string;
    // pathname: string;
    // search: string;
    path: string;
    query: string;
    fragment: string;

    queryParams: Record<string, string>;
};

export type UrlCreator = (url: string) => Url;
