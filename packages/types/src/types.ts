type InlineComposedItem = FragmentComposedItem | AnchorComposedItem | LinkComposedItem | InlineEntryComposedItem;

type InlineChildren = string | InlineComposedItem[];

type DecoratorTypeMap<T> = {
    code: T;
    delete: T;
    emphasis: T;
    insert: T;
    keyboard: T;
    linebreak: T;
    mark: T;
    strong: T;
    strikethrough: T;
    subscript: T;
    superscript: T;
    underline: T;
    variable: T;
};

type DecoratorType = keyof DecoratorTypeMap<any>;

type BaseSys = {
    id?: string;
    uri?: string;
    language?: string;
    contentTypeId?: string;
    projectId?: string;
    dataFormat?: string;
};

type BaseEntry<TSys extends BaseSys> = {
    sys: null | TSys;
    entryTitle?: string;
    entryDescription?: string;
    entryThumbnail?: ImageLink;
};

type EntrySys = {
    id?: string;
    uri?: string;
    language?: string;
    contentTypeId?: string;
    projectId?: string;
    dataFormat?: 'entry';
};

type EntryLink = BaseEntry<EntrySys>;

type ImageLink = {
    asset?: AssetLink;
    caption?: string;
    transformations?: Transformations;
    altText?: string;
};

type AssetSys = {
    id?: string;
    uri?: string;
    language?: string;
    contentTypeId?: string;
    projectId?: string;
    dataFormat?: 'asset';
};

type AssetLink = BaseEntry<AssetSys> & {
    altText?: string;
};

type Transformations = {
    size?: { width?: number; height?: number };
    flip?: null | 'h' | 'v' | 'both';
    rotate?: number;
    crop?: { width?: number; height?: number; x?: number; y?: number };
    quality?: number;
    format?: string;
};

type NodeLink = {
    displayName?: string;
    id?: string;
    includeInMenu?: boolean;
    isCanonical?: boolean;
    language?: string;
    path?: string;
    slug?: string;
};

type ComposedItem =
    | AnchorComposedItem 
    | CodeComposedItem 
    | ComponentComposedItem 
    | DividerComposedItem 
    | FragmentComposedItem
    | HeadingComposedItem 
    | ImageComposedItem
    | InlineEntryComposedItem 
    | LinkComposedItem 
    | ListComposedItem 
    | ListItemComposedItem 
    | PanelComposedItem 
    | ParagraphComposedItem
    | QuoteComposedItem
    | TableComposedItem 
    | TableBodyComposedItem 
    | TableCaptionComposedItem 
    | TableCellComposedItem 
    | TableFooterComposedItem
    | TableHeaderComposedItem 
    | TableHeaderCellComposedItem 
    | TableRowComposedItem;

type AnchorComposedItem = {
    type: '_anchor';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
    };
};

type CodeComposedItem = {
    type: '_code';
    id: string;
    value?: {
        code?: string;
        language?: string;
        caption?: string;
    };
    properties?: {
        id?: string;
    };
};

type ComponentComposedItem = {
    type: '_component';
    id: string;
    value?: Record<string, any>;
    properties?: {
        id?: string;
        component: string;
    };
};

type DividerComposedItem = {
    type: '_divider';
    id: string;
    value?: undefined;
    properties?: {
        id?: string;
    };
};

type FragmentComposedItem = {
    type: '_fragment';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        decorators?: DecoratorType[];
    };
};

type HeadingComposedItem = {
    type: '_heading';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        level?: number;
    };
};

type ImageComposedItem = {
    type: '_image';
    id: string;
    value?: ImageLink;
    properties?: {
        id?: string;
    };
};

type InlineEntryComposedItem = {
    type: '_inlineEntry';
    id: string;
    value?: EntryLink;
    properties?: {
        id?: string;
    };
};

type LinkComposedItem = {
    type: '_link';
    id: string;
    value?: InlineChildren;
    properties?: EntryLink & {
        id?: string;
        node?: NodeLink;
        anchor?: string;
        newTab?: boolean;
    };
};

type ListType = 'ordered' | 'unordered';

type ListComposedItem = {
    type: '_list';
    id: string;
    value?: ListItemComposedItem[];
    properties?: {
        id?: string;
        listType?: ListType;
        start?: number;
    };
};

type ListItemComposedItem = {
    type: '_listItem';
    id: string;
    value?: string | ComposedItem[];
    properties?: {
        id?: string;
    };
};

type PanelType = 'info' | 'note' | 'warning' | 'success' | 'error';

type PanelComposedItem = {
    type: '_panel';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        panelType?: PanelType;
    };
};

type ParagraphType = 'lead';

type ParagraphComposedItem = {
    type: '_paragraph';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        paragraphType?: ParagraphType;
    };
};

type QuoteComposedItem = {
    type: '_quote';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        url?: string;
        citation?: string;
        source?: string;
    };
};

type TableComposedItem = {
    type: '_table';
    id: string;
    value?: (TableCaptionComposedItem | TableHeaderComposedItem | TableBodyComposedItem | TableFooterComposedItem)[];
    properties?: {
        id?: string;
    };
};

type TableBodyComposedItem = {
    type: '_tableBody';
    id: string;
    value?: TableRowComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableCaptionComposedItem = {
    type: '_tableCaption';
    id: string;
    value?: string | ComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableCellComposedItem = {
    type: '_tableCell';
    id: string;
    value?: string | ComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableFooterComposedItem = {
    type: '_tableFooter';
    id: string;
    value?: TableRowComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableHeaderComposedItem = {
    type: '_tableHeader';
    id: string;
    value?: TableRowComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableHeaderCellComposedItem = {
    type: '_tableHeaderCell';
    id: string;
    value?: string | ComposedItem[];
    properties?: {
        id?: string;
    };
};

type TableRowComposedItem = {
    type: '_tableRow';
    id: string;
    value?: (TableCellComposedItem | TableHeaderCellComposedItem)[];
    properties?: {
        id?: string;
    };
};

export type {
    ComposedItem,

    AnchorComposedItem,
    CodeComposedItem,
    ComponentComposedItem,
    DividerComposedItem,
    FragmentComposedItem,
    HeadingComposedItem,
    ImageComposedItem,
    InlineEntryComposedItem,
    LinkComposedItem,
    ListComposedItem,
    ListItemComposedItem,
    PanelComposedItem,
    ParagraphComposedItem,
    QuoteComposedItem,
    TableComposedItem,
    TableBodyComposedItem,
    TableCaptionComposedItem,
    TableCellComposedItem,
    TableHeaderComposedItem,
    TableHeaderCellComposedItem,
    TableFooterComposedItem,
    TableRowComposedItem,

    DecoratorType
};