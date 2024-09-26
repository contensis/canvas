import { ListType, PanelType, ParagraphType, Block, DecoratorType } from './models';
import { ParserSettings } from '../parser';

type ImageType = 'managed' | 'external';
type LinkType = 'anchor' | 'uri' | 'entry' | 'node';
type CanvasEditorImageAction = 'crop' | 'upload';
type Required = 'required' | '';

type _Values<T> = {
    [P in keyof T]: T[P] extends boolean ? P : [P, T[P]];
};

type _Array<T> = {
    [P in keyof T]: T[P] extends boolean ? T[P] : null | Array<T[P]>;
};

type _ValueOf<T> = T[keyof T];

type NonBoolean<T> = {
    [P in keyof T as T[P] extends boolean ? never : P]: T[P];
};

type SettingNames = {
    'actions.contentEditable': boolean;
    'actions.deleteItem': boolean;
    'actions.duplicate': boolean;
    'actions.editorPanel': boolean;
    'actions.order': boolean;

    'decorator.code': boolean;
    'decorator.delete': boolean;
    'decorator.emphasis': boolean;
    'decorator.insert': boolean;
    'decorator.keyboard': boolean;
    'decorator.linebreak': boolean;
    'decorator.mark': boolean;
    'decorator.strikethrough': boolean;
    'decorator.strong': boolean;
    'decorator.subscript': boolean;
    'decorator.superscript': boolean;
    'decorator.underline': boolean;
    'decorator.variable': boolean;

    'editor.placeholder': string;

    'properties.friendlyId': boolean;

    'type.anchor': boolean;
    'type.code.language': string;
    'type.code': boolean;
    'type.component.component': string;
    'type.component': boolean;
    'type.divider': boolean;
    'type.formContentType.contentType': string;
    'type.formContentType': boolean;
    'type.heading.level': number;
    'type.heading': boolean;
    'type.image': boolean;
    'type.image.actions': CanvasEditorImageAction;
    'type.image.altTextRequired': Required;
    'type.image.altTextRequiredMessage': string;
    'type.image.captionRequired': Required;
    'type.image.captionRequiredMessage': string;
    'type.image.imageType': ImageType;
    'type.image.minWidth': number;
    'type.image.maxWidth': number;
    'type.image.minHeight': number;
    'type.image.maxHeight': number;
    'type.image.filterPaths': string;
    'type.image.uploadPath': string;

    'type.inlineEntry.contentType': string;
    'type.inlineEntry': boolean;
    'type.link.assetContentType': string;
    'type.link.assetFilterPaths': string;
    'type.link.contentType': string;
    'type.link.linkType': LinkType;
    'type.link': boolean;
    'type.liquid': boolean;
    'type.list.listType': ListType;
    'type.list': boolean;
    'type.quote': boolean;
    'type.panel.panelType': PanelType;
    'type.panel': boolean;
    'type.paragraph.paragraphType': ParagraphType;
    'type.table': boolean;
};

type SettingValues = _Values<SettingNames>;

export type CanvasSettings = _Array<SettingNames>;

export type CanvasSetting = 'required' | _ValueOf<SettingValues>;

export type ArraySettings = NonBoolean<SettingNames>;

export type CanvasSettingValue<T> = {
    enabled: boolean;
    value: T | null;
};

export interface ICanvasSettings {
    hasSetting(setting: CanvasSetting): boolean;
    fixSetting<TKey extends keyof ArraySettings>(
        key: TKey,
        value: ArraySettings[TKey],
        defaultValue: ArraySettings[TKey]
    ): CanvasSettingValue<ArraySettings[TKey]>;
    getSettingValue<TKey extends keyof ArraySettings>(key: TKey, defaultValue: ArraySettings[TKey]): ArraySettings[TKey];
    getSettingValues<TKey extends keyof ArraySettings>(key: TKey): ArraySettings[TKey][];
    getSystemSettings(): SystemSettings;
}

export interface SystemSettings extends ParserSettings {
    cmsUrl: string;
    language: string;
    uploadPath: string;
    permissions: {
        assets: Permissions;
        entries: Permissions;
    };
}

export interface Project {
    id: string;
    primaryLanguage: string;
    supportedLanguages: string[];
}

interface Permissions {
    [key: string]: Permission[];
}

interface Permission {
    contentTypeId: string;
    languages: string[];
}

export interface ICanvasSettingsProvider {
    getCanvasSettings(): CanvasSettings;
    getSystemSettings(): SystemSettings;
}

export function hasSetting(settings: CanvasSettings, setting: CanvasSetting) {
    setting = setting || 'required';
    if (setting === 'required') {
        return true;
    }
    if (typeof setting === 'string') {
        return settings[setting];
    }
    const [key, value] = setting;
    const parentKey = getParentKey(settings, key);
    if (parentKey && !settings[parentKey as keyof CanvasSettings]) {
        return false;
    }
    const settingValue = settings[key];
    return settingValue ? (settingValue as any).includes(value) : true;
}
export function fixSetting<TKey extends keyof ArraySettings>(
    settings: CanvasSettings,
    key: TKey,
    value: ArraySettings[TKey],
    defaultValue: ArraySettings[TKey]
): CanvasSettingValue<ArraySettings[TKey]> {
    const parentKey = getParentKey(settings, key);
    if (parentKey && !settings[parentKey as keyof CanvasSettings]) {
        return { enabled: false, value: null };
    }
    const settingValue = settings[key];
    if (!settingValue || settingValue.includes(value as any)) {
        return { enabled: true, value };
    }
    if (settingValue.includes(defaultValue as any)) {
        return { enabled: true, value: defaultValue };
    }
    const firstValue = settingValue[0];
    return typeof firstValue === 'undefined' ? { enabled: false, value: null } : { enabled: true, value: firstValue };
}

export function getSetting<TKey extends keyof ArraySettings>(settings: CanvasSettings, key: TKey, defaultValue: ArraySettings[TKey]): ArraySettings[TKey] {
    const parentKey = getParentKey(settings, key);
    if (parentKey && !settings[parentKey as keyof CanvasSettings]) {
        return defaultValue;
    }
    const settingValue = settings[key];
    return settingValue?.[0] || defaultValue;
}

function getParentKey(settings: CanvasSettings, key: string) {
    const parts = key.split('.');
    parts.pop();
    const parentKey = parts.join('.');
    return typeof settings[parentKey as keyof CanvasSettings] === 'undefined' ? null : parentKey;
}

export type CanvasField = {
    id: string;
    validations?: {
        allowedTypes?: CanvasAllowedTypesValidation;
    };
    editor?: {
        properties?: CanvasEditorProperties;
    };
};

type CanvasAllowedTypesValidation = {
    types: CanvasTypeValidation[];
    message?: Record<string, string>;
};

type CanvasType = Block['type'] | '*';

type CanvasDecorator = DecoratorType | '*';

type CanvasValidationSetting<T> = {
    allowed: T[];
    message?: Record<string, string>;
};

type CanvasTypeValidation = {
    type: CanvasType;
    languages?: CanvasValidationSetting<string>;
    components?: CanvasValidationSetting<string>;
    formContentTypes?: CanvasValidationSetting<string>;
    levels?: CanvasValidationSetting<number>;
    imageTypes?: CanvasValidationSetting<ImageType>;
    linkAssetContentTypes?: CanvasValidationSetting<string>;
    linkContentTypes?: CanvasValidationSetting<string>;
    linkTypes?: CanvasValidationSetting<LinkType>;
    listTypes?: CanvasValidationSetting<ListType>;
    panelTypes?: CanvasValidationSetting<PanelType>;
    paragraphTypes?: CanvasValidationSetting<ParagraphType>;
    decorators?: CanvasValidationSetting<{ decorator: CanvasDecorator }>;
    imageDimensions?: {
        message?: Record<string, string>;
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
    };
    captionRequired?: {
        message?: Record<string, string>;
    };
    altTextRequired?: {
        message?: Record<string, string>;
    };
};

type AllowedKeys = keyof Omit<CanvasTypeValidation, 'type' | 'decorators' | 'imageDimensions' | 'captionRequired' | 'altTextRequired'>;

type CanvasEditorProperties = {
    placeholderText?: string | Record<string, string>;
    uploadPath?: string;
    filterPaths?: string[];
    actions?: CanvasEditorActions;
    types?: CanvasEditorType[];
};

type CanvasEditorActions = {
    contentEditable?: boolean;
    customCommand?: boolean;
    deleteItem?: boolean;
    duplicate?: boolean;
    editorPanel?: boolean;
    order?: boolean;
};

export type CanvasEditorType = {
    type: CanvasType;

    // image
    imageActions?: CanvasEditorImageAction[];
    uploadPath?: string;

    // image and asset link
    filterPaths?: string[];
};

type CanvasEditorAction = keyof CanvasEditorActions;

function isPresent(o: any) {
    return !(typeof o === 'undefined' || o === null);
}

function isTypeEnabled(allowedTypes: CanvasAllowedTypesValidation, type: CanvasType) {
    const typeValidation = allowedTypes?.types?.find((t) => t.type === type || t.type === '*');
    return !allowedTypes || !!typeValidation;
}

function getType(allowedTypes: CanvasAllowedTypesValidation, type: CanvasType) {
    return allowedTypes?.types?.find((t) => t.type === type);
}

function getEditorType(properties: undefined | CanvasEditorProperties, type: CanvasType) {
    return properties?.types?.find((t) => t.type === type);
}

function isDecoratorEnabled(allowedTypes: CanvasAllowedTypesValidation, decorator: CanvasDecorator) {
    const allowedDecorators = getType(allowedTypes, '_fragment')?.decorators?.allowed;
    const decoratorValidation = allowedDecorators?.find((d) => d.decorator === decorator || d.decorator === '*');
    return !allowedDecorators || !!decoratorValidation;
}

function isActionEnabled(actions: CanvasEditorActions | undefined, action: CanvasEditorAction) {
    const value = actions?.[action];
    return isPresent(value) ? !!value : true;
}

function getAllowedValues<TAllowedKey extends AllowedKeys>(
    allowedTypes: CanvasAllowedTypesValidation,
    type: CanvasType,
    allowedKey: TAllowedKey
): NonNullable<CanvasTypeValidation[TAllowedKey]>['allowed'] {
    const validation = getType(allowedTypes, type);
    // strict mode refactor: this needs to be undefined sometimes but the types disagree
    // TODO: remove the any cast
    return validation?.[allowedKey]?.allowed as any;
}

function isTypeEnabledAndAllowed<TAllowedKey extends AllowedKeys>(allowedTypes: CanvasAllowedTypesValidation, type: CanvasType, allowedKey: TAllowedKey) {
    const isEnabled = isTypeEnabled(allowedTypes, type);
    const values = getAllowedValues(allowedTypes, type, allowedKey);

    return isEnabled && (!values || (Array.isArray(values) && !!values.length));
}

function getLocalisedValue(dict: undefined | string | Record<string, string>) {
    if (!dict) {
        return '';
    }
    if (typeof dict === 'string') {
        return dict;
    }
    return Object.values(dict).find((v) => !!v) || '';
}

function asArray<T>(item: T) {
    return item === null || typeof item === 'undefined' ? [] : [item];
}

export function createCanvasSettings(canvasField: CanvasField): CanvasSettings {
    const allowedTypes = canvasField?.validations?.allowedTypes as CanvasAllowedTypesValidation;
    const properties = canvasField?.editor?.properties;
    const actions = properties?.actions;
    const image = getType(allowedTypes, '_image');
    const imageEditor = getEditorType(properties, '_image');
    const linkEditor = getEditorType(properties, '_link');
    return {
        'actions.contentEditable': isActionEnabled(actions, 'contentEditable'),
        'actions.deleteItem': isActionEnabled(actions, 'deleteItem'),
        'actions.duplicate': isActionEnabled(actions, 'duplicate'),
        'actions.editorPanel': isActionEnabled(actions, 'editorPanel'),
        'actions.order': isActionEnabled(actions, 'contentEditable'),
        'decorator.code': isDecoratorEnabled(allowedTypes, 'code'),
        'decorator.delete': isDecoratorEnabled(allowedTypes, 'delete'),
        'decorator.emphasis': isDecoratorEnabled(allowedTypes, 'emphasis'),
        'decorator.insert': isDecoratorEnabled(allowedTypes, 'insert'),
        'decorator.keyboard': isDecoratorEnabled(allowedTypes, 'keyboard'),
        'decorator.linebreak': isDecoratorEnabled(allowedTypes, 'linebreak'),
        'decorator.mark': isDecoratorEnabled(allowedTypes, 'mark'),
        'decorator.strikethrough': isDecoratorEnabled(allowedTypes, 'strikethrough'),
        'decorator.strong': isDecoratorEnabled(allowedTypes, 'strong'),
        'decorator.subscript': isDecoratorEnabled(allowedTypes, 'subscript'),
        'decorator.superscript': isDecoratorEnabled(allowedTypes, 'superscript'),
        'decorator.underline': isDecoratorEnabled(allowedTypes, 'underline'),
        'decorator.variable': isDecoratorEnabled(allowedTypes, 'variable'),

        'editor.placeholder': [getLocalisedValue(canvasField?.editor?.properties?.placeholderText)],
        'properties.friendlyId': true,
        'type.anchor': isTypeEnabled(allowedTypes, '_anchor'),
        'type.code': isTypeEnabledAndAllowed(allowedTypes, '_code', 'languages'),
        'type.code.language': getAllowedValues(allowedTypes, '_code', 'languages'),
        'type.component': isTypeEnabledAndAllowed(allowedTypes, '_component', 'components'),
        'type.component.component': getAllowedValues(allowedTypes, '_component', 'components'),
        'type.divider': isTypeEnabled(allowedTypes, '_divider'),
        'type.formContentType': isTypeEnabled(allowedTypes, '_formContentType'),
        'type.formContentType.contentType': getAllowedValues(allowedTypes, '_formContentType', 'formContentTypes'),
        'type.heading': isTypeEnabledAndAllowed(allowedTypes, '_heading', 'levels'),
        'type.heading.level': getAllowedValues(allowedTypes, '_heading', 'levels'),
        'type.image': isTypeEnabled(allowedTypes, '_image'),
        'type.image.actions': imageEditor?.imageActions || null,
        'type.image.altTextRequired': isTypeEnabled(allowedTypes, '_image') && image?.altTextRequired ? ['required'] : [],
        'type.image.altTextRequiredMessage':
            isTypeEnabled(allowedTypes, '_image') && image?.altTextRequired?.message?.['en-GB'] ? [image.altTextRequired.message['en-GB']] : [],
        'type.image.captionRequired': isTypeEnabled(allowedTypes, '_image') && image?.captionRequired ? ['required'] : [],
        'type.image.captionRequiredMessage':
            isTypeEnabled(allowedTypes, '_image') && image?.captionRequired?.message?.['en-GB'] ? [image.captionRequired.message['en-GB']] : [],

        'type.image.filterPaths': isTypeEnabled(allowedTypes, '_image') ? imageEditor?.filterPaths || canvasField?.editor?.properties?.filterPaths || null : null,
        'type.image.minWidth': asArray(isTypeEnabled(allowedTypes, '_image') ? image?.imageDimensions?.minWidth : null),
        'type.image.maxWidth': asArray(isTypeEnabled(allowedTypes, '_image') ? image?.imageDimensions?.maxWidth : null),
        'type.image.minHeight': asArray(isTypeEnabled(allowedTypes, '_image') ? image?.imageDimensions?.minHeight : null),
        'type.image.maxHeight': asArray(isTypeEnabled(allowedTypes, '_image') ? image?.imageDimensions?.maxHeight : null),
        'type.image.uploadPath':
            isTypeEnabled(allowedTypes, '_image') && (imageEditor?.uploadPath || canvasField?.editor?.properties?.uploadPath)
                ? [(imageEditor?.uploadPath || canvasField?.editor?.properties?.uploadPath) as string]
                : null,

        'type.image.imageType': getAllowedValues(allowedTypes, '_image', 'imageTypes'),
        'type.inlineEntry': isTypeEnabled(allowedTypes, '_inlineEntry'),
        'type.inlineEntry.contentType': getAllowedValues(allowedTypes, '_inlineEntry', 'linkContentTypes'),
        'type.link': isTypeEnabledAndAllowed(allowedTypes, '_link', 'linkTypes'),
        'type.link.linkType': getAllowedValues(allowedTypes, '_link', 'linkTypes'),
        'type.link.assetContentType': getAllowedValues(allowedTypes, '_link', 'linkAssetContentTypes'),
        'type.link.assetFilterPaths': linkEditor?.filterPaths || null,
        'type.link.contentType': getAllowedValues(allowedTypes, '_link', 'linkContentTypes'),
        'type.liquid': false,

        'type.list': isTypeEnabledAndAllowed(allowedTypes, '_list', 'listTypes'),
        'type.list.listType': getAllowedValues(allowedTypes, '_list', 'listTypes'),
        'type.panel': isTypeEnabledAndAllowed(allowedTypes, '_panel', 'panelTypes'),
        'type.panel.panelType': getAllowedValues(allowedTypes, '_panel', 'panelTypes'),
        'type.paragraph.paragraphType': getAllowedValues(allowedTypes, '_paragraph', 'paragraphTypes'),
        'type.quote': isTypeEnabled(allowedTypes, '_quote'),
        'type.table': isTypeEnabled(allowedTypes, '_table')
    };
}
