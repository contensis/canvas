import {
    AnchorBlock,
    AssetBlock,
    CodeBlock,
    ComponentBlock,
    DividerBlock,
    EntryBlock,
    FormContentTypeBlock,
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
    TableFooterBlock,
    TableHeaderBlock,
    TableHeaderCellBlock,
    TableRowBlock
} from '@contensis/canvas-types';
import { createBlockRenderer, createDecoratorRenderer, createRendererFactory, fragment, getContents, RenderBlockProps, renderBlocks } from './renderer';

const anchor = createBlockRenderer<AnchorBlock>(({ contents }) => contents);

const asset = createBlockRenderer<AssetBlock>(
    ({ contents }) => contents,
    ({ block, encode }) => encode(block.value?.entryTitle || '')
);

const code = createBlockRenderer<CodeBlock>(
    ({ contents }) => `${contents}\n`,
    ({ block, encode }) => encode(block?.value?.code)
);

const component = createBlockRenderer<ComponentBlock>(
    ({ block, contents, renderers, context, encode }) => {
        const component = block.properties?.component;
        const renderer = !!component ? renderers?.components?.[component] : undefined;
        if (renderer) {
            return renderer({ block, renderers, context, encode });
        } else {
            return `${contents}\n`;
        }
    },
    ({ block, encode }) => encode(`Component: ${block?.properties?.component}`)
);

const divider = createBlockRenderer<DividerBlock>(
    () => `\n`,
    () => ''
);

const entry = createBlockRenderer<EntryBlock>(
    ({ contents }) => contents,
    ({ block, encode }) => encode(block.value?.entryTitle || '')
);

const formContentType = createBlockRenderer<FormContentTypeBlock>(
    ({ contents }) => `${contents}\n`,
    ({ block, encode }) => encode(`Form: ${block?.value?.contentType?.id}`)
);

const heading = createBlockRenderer<HeadingBlock>(({ contents }) => `${contents}\n`);

const image = createBlockRenderer<ImageBlock>(
    () => '',
    () => ''
);

const inlineEntry = createBlockRenderer<InlineEntryBlock>(
    ({ contents }) => contents,
    ({ block, encode }) => encode(block.value?.entryTitle || '')
);

const link = createBlockRenderer<LinkBlock>(({ contents }) => contents);

const liquid = createBlockRenderer<LiquidBlock>(
    ({ contents }) => contents,
    ({ block, encode }) => encode(block?.value)
);

const list = function (props: RenderBlockProps<ListBlock>, ...children: string[]) {
    const { block, context, renderers, encode } = props;
    const parentList = !!context.list;
    context.list = block;
    const contents = getContents(children, () => list.children({ block, context, renderers, encode }));
    return parentList ? `\n${contents}` : `${contents}\n`;
};

list.children = function (props: RenderBlockProps<ListBlock>) {
    const { block, context, encode, renderers } = props;
    const blocks = renderBlocks({ blocks: block.value || [], context, encode, renderers });
    return blocks.join('\n');
};

const listItem = createBlockRenderer<ListItemBlock>(({ contents }) => contents);
const panel = createBlockRenderer<PanelBlock>(({ contents }) => `${contents}\n`);
const paragraph = createBlockRenderer<ParagraphBlock>(({ contents }) => `${contents}\n`);
const quote = createBlockRenderer<QuoteBlock>(({ contents }) => `${contents}\n`);
const table = createBlockRenderer<TableBlock>(({ contents }) => contents);
const tableBody = createBlockRenderer<TableBodyBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableCaption = createBlockRenderer<TableCaptionBlock>(({ contents }) => `${contents}\n`);
const tableCell = createBlockRenderer<TableCellBlock>(({ contents }) => contents);
const tableFooter = createBlockRenderer<TableFooterBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableHeader = createBlockRenderer<TableHeaderBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableHeaderCell = createBlockRenderer<TableHeaderCellBlock>(({ contents }) => contents);
const tableRow = createBlockRenderer<TableRowBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const cells = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return cells.join(' ');
    }
);

const inlineCode = createDecoratorRenderer('');
const inlineDelete = createDecoratorRenderer('');
const emphasis = createDecoratorRenderer('');
const insert = createDecoratorRenderer('');
const keyboard = createDecoratorRenderer('');
const mark = createDecoratorRenderer('');

function lineBreak() {
    return `\n`;
}

lineBreak.children = function () {
    return null;
};

const strikethrough = createDecoratorRenderer('');
const strong = createDecoratorRenderer('');
const subscript = createDecoratorRenderer('');
const superscript = createDecoratorRenderer('');
const underline = createDecoratorRenderer('');
const variable = createDecoratorRenderer('');

const createRenderer = createRendererFactory(
    {
        _anchor: anchor,
        _asset: asset,
        _code: code,
        _component: component,
        _divider: divider,
        _entry: entry,
        _formContentType: formContentType,
        _fragment: fragment,
        _heading: heading,
        _image: image,
        _inlineEntry: inlineEntry,
        _link: link,
        _liquid: liquid,
        _list: list,
        _listItem: listItem,
        _quote: quote,
        _panel: panel,
        _paragraph: paragraph,
        _table: table,
        _tableBody: tableBody,
        _tableCaption: tableCaption,
        _tableCell: tableCell,
        _tableFooter: tableFooter,
        _tableHeader: tableHeader,
        _tableHeaderCell: tableHeaderCell,
        _tableRow: tableRow
    },
    {
        code: inlineCode,
        delete: inlineDelete,
        emphasis: emphasis,
        insert: insert,
        keyboard: keyboard,
        linebreak: lineBreak,
        mark: mark,
        strikethrough: strikethrough,
        strong: strong,
        subscript: subscript,
        superscript: superscript,
        underline: underline,
        variable: variable
    },
    (s) => `${s}`
);

export {
    anchor,
    code,
    component,
    createRenderer,
    divider,
    emphasis,
    heading,
    image,
    inlineCode,
    inlineDelete,
    inlineEntry,
    insert,
    keyboard,
    lineBreak,
    link,
    list,
    listItem,
    mark,
    panel,
    paragraph,
    quote,
    strikethrough,
    strong,
    subscript,
    superscript,
    table,
    tableBody,
    tableCaption,
    tableCell,
    tableFooter,
    tableHeader,
    tableHeaderCell,
    tableRow,
    underline,
    variable
};

