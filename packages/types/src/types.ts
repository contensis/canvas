

export type ComposedItemTypeMap<T> = {
    _code: T,
    _component: T,
    _divider: T,
    _heading: T,
    _image: T,
    _list: T,
    _listItem: T,
    _panel: T,
    _paragraph: T,
    _table: T,
    _tableBody: T,
    _tableCaption: T,
    _tableCell: T,
    _tableFooter: T,
    _tableHeader: T,
    _tableHeaderCell: T,
    _tableRow: T,

    // inline
    _anchor: T,
    _fragment: T,
    _link: T,
    _inlineEntry: T,
};

export type ComposedItemType = keyof ComposedItemTypeMap<any>;
export type ComposedItemProperties = { id?: string };

export type DecoratorTypeMap<T> = {
    code: T,
    delete: T,
    emphasis: T,
    insert: T,
    keyboard: T,
    linebreak: T,
    mark: T,
    strong: T,
    strikethrough: T,
    subscript: T,
    superscript: T,
    underline: T,
    variable: T,
};

export type DecoratorType = keyof DecoratorTypeMap<any>;

export type ListType = 'ordered' | 'unordered';

export type PanelType = 'info' | 'note' | 'warning' | 'success' | 'error';

export type ParagraphType = 'lead';

export type GenericComposedItem<TType extends ComposedItemType, TValue, TProperties extends ComposedItemProperties = ComposedItemProperties> = {
    id: string,
    type: TType,
    value?: TValue,
    properties?: TProperties
};

export type FragmentComposedItem = GenericComposedItem<'_fragment', InlineChildren, FragmentProperties>;

export type FragmentProperties = {
    id?: string,
    decorators?: DecoratorType[]
};

export type LinkComposedItem = GenericComposedItem<'_link', InlineChildren, LinkProperties>;

export type EntryLink = {
    sys: {
        id?: string;
        uri?: string;
        language?: string;
    },
    entryTitle?: string,
    entryDescription?: string
};

export type NodeLink = {
    id: string,
    language?: string
    path?: string
};

type AssetLink = EntryLink;

export type LinkProperties = {
    id?: string,
    entry?: EntryLink,
    node?: NodeLink,
    url?: string,
    anchor?: string,
    newTab?: boolean
};

export type AnchorComposedItem = GenericComposedItem<'_anchor', InlineChildren>;

export type InlineEntryComposedItem = GenericComposedItem<'_inlineEntry', InlineEntryValue>;

export type InlineEntryValue = EntryLink;

export type ImageComposedItem = GenericComposedItem<'_image', ImageValue>;

export type ImageValue = {
    asset?: AssetLink;
    caption?: string;
    transformations?: Transformations;
    altText?: string;
    url?: string
};

export type Transformations = {
    size?: { width?: number, height?: number },
    flip?: null | 'h' | 'v' | 'both',
    rotate?: number,
    crop?: { width?: number, height?: number, x?: number, y?: number },
    quality?: number;
    format?: string;
};

export type CodeComposedItem = GenericComposedItem<'_code', CodeValue>;

export type CodeValue = {
    code?: string,
    language?: string,
    caption?: string
};

export type ComponentComposedItem = GenericComposedItem<'_component', ComponentValue, ComponentProperties>;

export type ComponentProperties = {
    id? : string,
    component: string
};

export type ComponentValue = Record<string, any>;

export type DividerComposedItem = GenericComposedItem<'_divider', undefined>;
export type HeadingComposedItem = GenericComposedItem<'_heading', HeadingChildren, HeadingProperties>;

export type HeadingProperties = {
    id? : string,
    level?: number
};

export type HeadingChildren = StringOrInline;

export type ListComposedItem = GenericComposedItem<'_list', ListChildren, ListProperties>;
export type ListItemComposedItem = GenericComposedItem<'_listItem', ListItemChildren>;

export type ListProperties = {
    id? : string,
    listType?: ListType,
    start?: number
};

export type ListChildren = ListItemComposedItem[];
export type ListItemChildren = StringOrInline | ComposedItem[];

export type PanelComposedItem = GenericComposedItem<'_panel', PanelChildren, PanelProperties>;

export type PanelProperties = {
    id? : string,
    panelType: PanelType
};

export type PanelChildren = StringOrInline;

export type ParagraphComposedItem = GenericComposedItem<'_paragraph', ParagraphChildren, ParagraphProperties>;

export type ParagraphProperties = {
    id? : string,
    paragraphType?: ParagraphType,
    spacer?: boolean
};

export type ParagraphChildren = StringOrInline;

export type TableComposedItem = GenericComposedItem<'_table', TableChildren>;
export type TableCaptionComposedItem = GenericComposedItem<'_tableCaption', TableCaptionChildren>;
export type TableHeaderComposedItem = GenericComposedItem<'_tableHeader', TableHeaderChildren>;
export type TableBodyComposedItem = GenericComposedItem<'_tableBody', TableBodyChildren>;
export type TableFooterComposedItem = GenericComposedItem<'_tableFooter', TableFooterChildren>;
export type TableRowComposedItem = GenericComposedItem<'_tableRow', TableRowChildren>;
export type TableCellComposedItem = GenericComposedItem<'_tableCell', TableCellChildren>;
export type TableHeaderCellComposedItem = GenericComposedItem<'_tableHeaderCell', TableHeaderCellChildren>;

export type TableChildren = TableChild[];
export type TableCaptionChildren = StringOrInline | TableCaptionChild[];
export type TableHeaderChildren = TableHeaderChild[];
export type TableBodyChildren = TableBodyChild[];
export type TableFooterChildren = TableFooterChild[];
export type TableRowChildren = TableRowChild[];
export type TableCellChildren = StringOrInline | TableCellChild[];
export type TableHeaderCellChildren = StringOrInline | TableHeaderCellChild[];

export type TableChild = TableCaptionComposedItem | TableHeaderComposedItem | TableBodyComposedItem | TableFooterComposedItem;
export type TableCaptionChild = ComposedItem;
export type TableHeaderChild = TableRowComposedItem;
export type TableBodyChild = TableRowComposedItem;
export type TableFooterChild = TableRowComposedItem;
export type TableRowChild = TableCellComposedItem | TableHeaderCellComposedItem;
export type TableCellChild = ComposedItem;
export type TableHeaderCellChild = ComposedItem;

type InlineChildren = StringOrInline;

export type InlineComposedItem = FragmentComposedItem | AnchorComposedItem | LinkComposedItem | InlineEntryComposedItem;

export type StringOrInline = string | InlineComposedItem[];

export type ComposedItem = CodeComposedItem | ComponentComposedItem | DividerComposedItem | HeadingComposedItem | ImageComposedItem 
    | ListComposedItem | ListItemComposedItem | PanelComposedItem | ParagraphComposedItem | TableComposedItem | TableBodyComposedItem
    | TableCaptionComposedItem | TableCellComposedItem | TableFooterComposedItem | TableHeaderComposedItem | TableHeaderCellComposedItem
    | TableRowComposedItem | AnchorComposedItem | FragmentComposedItem | LinkComposedItem | InlineEntryComposedItem;
    