import { Block, DecoratorType, CanvasSettings, isInlineType } from '../../models';

export type AllowedTypes = Record<Block['type'], boolean>;
export type AllowedDecorators = Record<DecoratorType, boolean>;
export type AllowedChildren = Record<Block['type'], AllowedTypes>;

const DEFAULT_ALLOWED_CHILDREN: AllowedTypes = {
    _code: isInlineType('_code'),
    _component: isInlineType('_component'),
    _divider: isInlineType('_divider'),
    _heading: isInlineType('_heading'),
    _image: isInlineType('_image'),
    _list: isInlineType('_list'),
    _listItem: isInlineType('_list'),
    _panel: isInlineType('_panel'),
    _paragraph: isInlineType('_paragraph'),
    _quote: isInlineType('_quote'),
    _table: isInlineType('_table'),
    _tableBody: isInlineType('_tableBody'),
    _tableCaption: isInlineType('_tableCaption'),
    _tableCell: isInlineType('_tableCell'),
    _tableFooter: isInlineType('_tableFooter'),
    _tableHeader: isInlineType('_tableHeader'),
    _tableHeaderCell: isInlineType('_tableHeaderCell'),
    _tableRow: isInlineType('_tableRow'),
    _anchor: isInlineType('_anchor'),
    _fragment: isInlineType('_fragment'),
    _link: isInlineType('_link'),
    _inlineEntry: isInlineType('_inlineEntry')
};

const NO_CHILDREN: AllowedTypes = {
    _code: false,
    _component: false,
    _divider: false,
    _heading: false,
    _image: false,
    _list: false,
    _listItem: false,
    _panel: false,
    _paragraph: false,
    _quote: false,
    _table: false,
    _tableBody: false,
    _tableCaption: false,
    _tableCell: false,
    _tableFooter: false,
    _tableHeader: false,
    _tableHeaderCell: false,
    _tableRow: false,
    _anchor: false,
    _fragment: false,
    _link: false,
    _inlineEntry: false
};

export const ROOT_CHILDREN: AllowedTypes = {
    _code: true,
    _component: true,
    _divider: true,
    _heading: true,
    _image: true,
    _list: true,
    _listItem: false,
    _panel: true,
    _paragraph: true,
    _quote: true,
    _table: true,
    _tableBody: false,
    _tableCaption: false,
    _tableCell: false,
    _tableFooter: false,
    _tableHeader: false,
    _tableHeaderCell: false,
    _tableRow: false,
    _anchor: true,
    _fragment: true,
    _link: true,
    _inlineEntry: true
};

export const DECORATOR_CHILDREN: AllowedTypes = {
    _code: false,
    _component: false,
    _divider: false,
    _heading: false,
    _image: false,
    _list: false,
    _listItem: false,
    _panel: false,
    _paragraph: false,
    _quote: false,
    _table: false,
    _tableBody: false,
    _tableCaption: false,
    _tableCell: false,
    _tableFooter: false,
    _tableHeader: false,
    _tableHeaderCell: false,
    _tableRow: false,
    _anchor: true,
    _fragment: true,
    _link: true,
    _inlineEntry: true
};

export const ALLOWED_CHILDREN: AllowedChildren = {
    _code: DEFAULT_ALLOWED_CHILDREN,
    _component: NO_CHILDREN,
    _divider: NO_CHILDREN,
    _heading: DEFAULT_ALLOWED_CHILDREN,
    _image: NO_CHILDREN,
    _list: { ...NO_CHILDREN, _listItem: true },
    _listItem: { ...DEFAULT_ALLOWED_CHILDREN, _list: true },
    _panel: DEFAULT_ALLOWED_CHILDREN,
    _paragraph: DEFAULT_ALLOWED_CHILDREN,
    _quote: DEFAULT_ALLOWED_CHILDREN,
    _table: {
        ...NO_CHILDREN,
        _tableBody: true,
        _tableCaption: true,
        _tableFooter: true,
        _tableHeader: true,
        _tableRow: true
    },
    _tableBody: { ...NO_CHILDREN, _tableRow: true },
    _tableCaption: DEFAULT_ALLOWED_CHILDREN,
    _tableCell: DEFAULT_ALLOWED_CHILDREN,
    _tableFooter: { ...NO_CHILDREN, _tableRow: true },
    _tableHeader: { ...NO_CHILDREN, _tableRow: true },
    _tableHeaderCell: DEFAULT_ALLOWED_CHILDREN,
    _tableRow: { ...NO_CHILDREN, _tableCell: true, _tableHeaderCell: true },
    _anchor: { ...NO_CHILDREN, _fragment: true },
    _fragment: DEFAULT_ALLOWED_CHILDREN,
    _link: { ...NO_CHILDREN, _fragment: true },
    _inlineEntry: { ...NO_CHILDREN, _fragment: true }
};

export const ALL_DECORATORS: AllowedDecorators = {
    code: true,
    delete: true,
    emphasis: true,
    insert: true,
    keyboard: true,
    linebreak: true,
    mark: true,
    strong: true,
    strikethrough: true,
    subscript: true,
    superscript: true,
    underline: true,
    variable: true
};

export function settingsToTypes(settings: CanvasSettings): AllowedTypes {
    return {
        _code: settings['type.code'],
        _component: settings['type.component'],
        _divider: settings['type.divider'],
        _heading: settings['type.heading'],
        _image: settings['type.image'],
        _list: settings['type.list'],
        _listItem: settings['type.list'],
        _panel: settings['type.panel'],
        _paragraph: true,
        _quote: settings['type.quote'],
        _table: settings['type.table'],
        _tableBody: settings['type.table'],
        _tableCaption: settings['type.table'],
        _tableCell: settings['type.table'],
        _tableFooter: settings['type.table'],
        _tableHeader: settings['type.table'],
        _tableHeaderCell: settings['type.table'],
        _tableRow: settings['type.table'],
        _anchor: settings['type.anchor'],
        _fragment: true,
        _link: settings['type.link'],
        _inlineEntry: settings['type.inlineEntry']
    };
}

export function settingsToDecorators(settings: CanvasSettings): AllowedDecorators {
    return {
        code: settings['decorator.code'],
        delete: settings['decorator.delete'],
        emphasis: settings['decorator.emphasis'],
        insert: settings['decorator.insert'],
        keyboard: settings['decorator.keyboard'],
        linebreak: settings['decorator.linebreak'],
        mark: settings['decorator.mark'],
        strong: settings['decorator.strong'],
        strikethrough: settings['decorator.strikethrough'],
        subscript: settings['decorator.subscript'],
        superscript: settings['decorator.superscript'],
        underline: settings['decorator.underline'],
        variable: settings['decorator.variable']
    };
}
