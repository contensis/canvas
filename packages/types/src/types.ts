type InlineBlock = FragmentBlock | AnchorBlock | LinkBlock | InlineEntryBlock;

type InlineChildren = string | InlineBlock[];

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
    entryThumbnail?: Image;
};

type EntrySys = {
    id?: string;
    uri?: string;
    language?: string;
    contentTypeId?: string;
    projectId?: string;
    dataFormat?: 'entry';
};

type Entry = BaseEntry<EntrySys>;

type Image = {
    asset?: Asset;
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
    properties?: {
        width?: number;
        height?: number;
    };
};

type Asset = BaseEntry<AssetSys> & {
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

type Node = {
    displayName?: string;
    id?: string;
    includeInMenu?: boolean;
    isCanonical?: boolean;
    language?: string;
    path?: string;
    slug?: string;
};

type LinkType = 'entry' | 'node' | 'uri';

type LinkProperties = {
    query?: string;
    fragment?: string;
    type: LinkType;
};

type LinkSys = EntrySys & {
    linkProperties: LinkProperties;
    node?: Node;
};

type Link = BaseEntry<LinkSys>;

type Block =
    | AnchorBlock
    | AssetBlock
    | CodeBlock
    | ComponentBlock
    | DividerBlock
    | EntryBlock
    | FormContentTypeBlock
    | FragmentBlock
    | HeadingBlock
    | ImageBlock
    | InlineEntryBlock
    | LinkBlock
    | LiquidBlock
    | ListBlock
    | ListItemBlock
    | PanelBlock
    | ParagraphBlock
    | QuoteBlock
    | TableBlock
    | TableBodyBlock
    | TableCaptionBlock
    | TableCellBlock
    | TableFooterBlock
    | TableHeaderBlock
    | TableHeaderCellBlock
    | TableRowBlock;

type AnchorBlock = {
    type: '_anchor';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
    };
};

type AssetBlock = {
    type: '_asset';
    id: string;
    value?: Asset;
    properties?: {
        id?: string;
    };
};

type CodeBlock = {
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

type ComponentBlock<T extends Record<string, any> = any> = {
    type: '_component';
    id: string;
    value?: T;
    properties?: {
        id?: string;
        component: string;
    };
};

type DividerBlock = {
    type: '_divider';
    id: string;
    value?: undefined;
    properties?: {
        id?: string;
    };
};

type EntryBlock = {
    type: '_entry';
    id: string;
    value?: Entry;
    properties?: {
        id?: string;
    };
};

type FormContentType = {
    id: string;
};

type FormContentTypeBlock = {
    type: '_formContentType';
    id: string;
    properties?: {
        id?: string;
    };
    value?: {
        contentType?: FormContentType;
    };
};

type FragmentBlock = {
    type: '_fragment';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        decorators?: DecoratorType[];
    };
};

type HeadingBlock = {
    type: '_heading';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        level?: number;
    };
};

type ImageBlock = {
    type: '_image';
    id: string;
    value?: Image;
    properties?: {
        id?: string;
    };
};

type InlineEntryBlock = {
    type: '_inlineEntry';
    id: string;
    value?: Entry;
    properties?: {
        id?: string;
    };
};

type LinkBlock = {
    type: '_link';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        link?: Link;
        newTab?: boolean;
    };
};

type LiquidType = 'tag' | 'variable';

type LiquidBlock = {
    type: '_liquid';
    id: string;
    value?: string;
    properties?: {
        id?: string;
        type?: LiquidType;
    };
};

type ListType = 'ordered' | 'unordered';

type ListBlock = {
    type: '_list';
    id: string;
    value?: ListItemBlock[];
    properties?: {
        id?: string;
        listType?: ListType;
        start?: number;
    };
};

type ListItemBlock = {
    type: '_listItem';
    id: string;
    value?: string | Block[];
    properties?: {
        id?: string;
    };
};

type PanelType = 'info' | 'note' | 'warning' | 'success' | 'error';

type PanelBlock = {
    type: '_panel';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        panelType?: PanelType;
    };
};

type ParagraphType = 'lead';

type ParagraphBlock = {
    type: '_paragraph';
    id: string;
    value?: InlineChildren;
    properties?: {
        id?: string;
        paragraphType?: ParagraphType;
    };
};

type QuoteBlock = {
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

type TableBlock = {
    type: '_table';
    id: string;
    value?: (TableCaptionBlock | TableHeaderBlock | TableBodyBlock | TableFooterBlock)[];
    properties?: {
        id?: string;
    };
};

type TableBodyBlock = {
    type: '_tableBody';
    id: string;
    value?: TableRowBlock[];
    properties?: {
        id?: string;
    };
};

type TableCaptionBlock = {
    type: '_tableCaption';
    id: string;
    value?: string | Block[];
    properties?: {
        id?: string;
    };
};

type TableCellBlock = {
    type: '_tableCell';
    id: string;
    value?: string | Block[];
    properties?: {
        id?: string;
    };
};

type TableFooterBlock = {
    type: '_tableFooter';
    id: string;
    value?: TableRowBlock[];
    properties?: {
        id?: string;
    };
};

type TableHeaderBlock = {
    type: '_tableHeader';
    id: string;
    value?: TableRowBlock[];
    properties?: {
        id?: string;
    };
};

type TableHeaderCellBlock = {
    type: '_tableHeaderCell';
    id: string;
    value?: string | Block[];
    properties?: {
        id?: string;
    };
};

type TableRowBlock = {
    type: '_tableRow';
    id: string;
    value?: (TableCellBlock | TableHeaderCellBlock)[];
    properties?: {
        id?: string;
    };
};

export type {
    Block,

    AnchorBlock,
    AssetBlock,
    CodeBlock,
    ComponentBlock,
    DividerBlock,
    EntryBlock,
    FormContentTypeBlock,
    FragmentBlock,
    HeadingBlock,
    ImageBlock,
    InlineEntryBlock,
    LinkBlock,
    LiquidBlock,
    ListBlock,
    ListItemBlock,
    PanelBlock,
    ParagraphBlock,
    QuoteBlock,
    TableBlock,
    TableBodyBlock,
    TableCaptionBlock,
    TableCellBlock,
    TableHeaderBlock,
    TableHeaderCellBlock,
    TableFooterBlock,
    TableRowBlock,

    DecoratorType
};