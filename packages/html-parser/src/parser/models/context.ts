import { Block, DecoratorType, CanvasSetting, CanvasSettingValue, ArraySettings } from '../../models';
import { VoidFn, ICanvasDataProvider, Attributes, Element } from './models';
import {
    AllowedTypes,
    AllowedDecorators,
    settingsToTypes,
    settingsToDecorators,
    ROOT_CHILDREN,
    ALLOWED_CHILDREN,
    DECORATOR_CHILDREN,
    ALL_DECORATORS
} from './schema';
import { uuid } from '../../utils';

type TypeElement = {
    type: Block['type'];
    element: Element;
};

export class Context {
    get settings() {
        return this.dataProvider.settings;
    }

    get parserSettings() {
        return this.dataProvider.parserSettings;
    }

    private typeSettings: AllowedTypes;
    private typeContext: AllowedTypes;
    private decoratorSettings: AllowedDecorators;
    private decoratorContext: AllowedDecorators;
    private elements: TypeElement[] = [];
    private ancestors: Element[] = [];

    constructor(private dataProvider: ICanvasDataProvider) {
        this.typeSettings = settingsToTypes(dataProvider.settings);
        this.typeContext = ROOT_CHILDREN;
        this.decoratorSettings = settingsToDecorators(dataProvider.settings);
        this.decoratorContext = ALL_DECORATORS;
    }

    setType(type: Block['type'], element: Element) {
        if (this.typeSettings[type]) {
            const typeContext = this.typeContext;
            const decoratorContext = this.decoratorContext;

            this.typeContext = ALLOWED_CHILDREN[type];
            this.decoratorContext = ALL_DECORATORS;
            this.elements.push({ type, element });

            return () => {
                this.typeContext = typeContext;
                this.decoratorContext = decoratorContext;
                this.elements.pop();
            };
        } else {
            // type is not allowed so keep the same context
            return () => {};
        }
    }

    getParent(type: Block['type']) {
        return [...this.elements].reverse().find((e) => e.type === type)?.element;
    }

    push(element: Element) {
        this.ancestors.push(element);
        return () => this.ancestors.pop();
    }

    getAncestor(Type: any) {
        return [...this.ancestors].reverse().find((e) => e instanceof Type);
    }

    canAddType(type: Block['type']) {
        return this.typeSettings[type] && this.typeContext[type];
    }

    setDecorator(type: DecoratorType): VoidFn {
        // don;t check settings if you are in a decorator tag regardless of if it's allowed we should stop block elements
        const typeContext = this.typeContext;
        const decoratorContext = this.decoratorContext;

        this.typeContext = DECORATOR_CHILDREN;
        this.decoratorContext = {
            ...decoratorContext,
            [type]: false
        };
        return () => {
            this.typeContext = typeContext;
            this.decoratorContext = decoratorContext;
        };
    }

    canAddDecorator(type: DecoratorType) {
        return this.decoratorSettings[type] && this.decoratorContext[type];
    }

    hasSetting(setting: CanvasSetting): boolean {
        return this.dataProvider.hasSetting(setting);
    }

    fixSetting<TKey extends keyof ArraySettings>(
        key: TKey,
        value: ArraySettings[TKey],
        defaultValue: ArraySettings[TKey]
    ): CanvasSettingValue<ArraySettings[TKey]> {
        return this.dataProvider.fixSetting(key, value, defaultValue);
    }

    withFriendlyId<T extends { id?: string }>(properties: T, attributes: Attributes): T & { id?: string } {
        let id = properties?.id || attributes?.id;
        if (id) {
            id = this.dataProvider.findFriendlyId(id);
        }
        if (this.hasSetting('properties.friendlyId') && id) {
            properties = {
                ...(properties || {}),
                id
            } as T;
        } else if (properties) {
            const { id: _id, ...otherProperties } = properties;
            properties = otherProperties as T;
        }
        return properties;
    }

    id(attributes: Attributes) {
        let id = attributes['data-uuid'];
        if (id) {
            id = this.dataProvider.findId(id);
        }
        return id || uuid();
    }

    findFriendlyId(id: string) {
        if (id) {
            id = this.dataProvider.findFriendlyId(id);
        }
        return id;
    }

    getAsset(key: string) {
        return this.dataProvider.getAsset(key);
    }

    getImage(key: string) {
        return this.dataProvider.getImage(key);
    }

    getEntry(key: string) {
        return this.dataProvider.getEntry(key);
    }

    getNode(key: string) {
        return this.dataProvider.getNode(key);
    }

    getAbsoluteUrl(url: string) {
        return this.dataProvider.getAbsoluteUrl(url);
    }

    getUrl(url: string) {
        return this.dataProvider.getUrl(url);
    }
}

export function tryParse<T>(json: string) {
    let value: any = null;
    if (json) {
        try {
            value = JSON.parse(json);
        } catch {}
    }
    return value as T;
}
