import { RenderBlockProps, createBlockRenderer, createDecoratorRenderer, createRendererFactory, fragment, getContents, renderBlocks } from '@contensis/canvas-text';
import {
    AnchorBlock,
    CodeBlock,
    ComponentBlock,
    DividerBlock,
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
import { htmlEncode } from './html';

const anchor = createBlockRenderer<AnchorBlock>(({ contents }) => contents);
const code = createBlockRenderer<CodeBlock>(
    ({ block, contents }) => `${'```'}${block.value?.language || ''}\n${contents}${'```'}\n\n`,
    ({ block, encode }) => encode(block?.value?.code)
);

const component = createBlockRenderer<ComponentBlock>(
    ({ block, contents, renderers, context, encode }) => {
        const component = block.properties?.component;
        const renderer = !!component ? renderers?.components?.[component] : undefined;
        if (renderer) {
            return renderer({ block, renderers, context, encode });
        } else {
            return `${contents}\n\n`;
        }
    },
    ({ block, encode }) => encode(`Component: ${block?.properties?.component}`)
);

const divider = createBlockRenderer<DividerBlock>(
    () => `---\n\n`,
    () => ''
);

const formContentType = createBlockRenderer<FormContentTypeBlock>(
    ({ contents }) => `${contents}\n\n`,
    ({ block, encode }) => encode(`Form: ${block?.value?.contentType?.id}`)
);

const heading = createBlockRenderer<HeadingBlock>(({ block, contents }) => {
    const levels: Record<number, string> = {
        1: '#',
        2: '##',
        3: '###',
        4: '####',
        5: '#####',
        6: '######'
    };
    const level = block?.properties?.level || 1;
    const tagName = levels[level] || '#';
    return `${tagName} ${contents}\n\n`;
});

const image = createBlockRenderer<ImageBlock>(
    ({ block, encode }) => {
        const src = block?.value?.asset?.sys?.uri;
        const altText = encode(block?.value?.altText || '');
        const caption = encode(block?.value?.caption || '');
        const url = caption ? `${src} "${caption}"` : src;
        return `![${altText}](${url})\n\n`;
    },
    () => ''
);

const inlineEntry = createBlockRenderer<InlineEntryBlock>(
    ({ block, contents }) => {
        const href = block?.value?.sys?.uri;
        return href ? `[${contents}](${href})` : contents;
    },
    ({ block, encode }) => encode(block.value?.entryTitle || '')
);

const link = createBlockRenderer<LinkBlock>(({ block, contents }) => {
    const href = block.properties?.link?.sys?.uri;
    return href ? `[${contents}](${href})` : contents;
});

const liquid = createBlockRenderer<LiquidBlock>(
    ({ contents }) => contents,
    ({ block }) => block?.value || ''
);

const list = function (props: RenderBlockProps<ListBlock>, ...children: string[]) {
    const { block, context, renderers, encode } = props;
    const parentList = !!context.list;
    context.list = block;
    context.indent = parentList ? context.indent + '\t' : '';
    const contents = getContents(children, () => list.children({ block, context, renderers, encode }));
    return parentList ? `\n${contents}` : `${contents}\n`;
};

list.children = function (props: RenderBlockProps<ListBlock>) {
    const { block, context, encode, renderers } = props;
    const isOrdered = block?.properties?.listType === 'ordered';
    const start = block?.properties?.start || 1;

    const blocks = renderBlocks({ blocks: block.value || [], context, encode, renderers }).map((block, index) => {
        const prefix = isOrdered ? `${start + index}.` : '*';
        return `${context.indent || ''}${prefix} ${block}`;
    });

    return blocks.join('\n');
};

const listItem = createBlockRenderer<ListItemBlock>(({ contents }) => contents);
const panel = createBlockRenderer<PanelBlock>(({ contents }) => `${contents}\n\n`);
const paragraph = createBlockRenderer<ParagraphBlock>(({ contents }) => `${contents}\n\n`);
const quote = createBlockRenderer<QuoteBlock>(({ contents }) => `> ${contents}\n\n`);

const table = createBlockRenderer<TableBlock>(({ contents }) => `${contents}\n`);
const tableBody = createBlockRenderer<TableBodyBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableCaption = createBlockRenderer<TableCaptionBlock>(() => '');
const tableCell = createBlockRenderer<TableCellBlock>(({ contents }) => contents);
const tableFooter = createBlockRenderer<TableFooterBlock>(
    ({ contents }) => contents,
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableHeader = createBlockRenderer<TableHeaderBlock>(
    ({ block, contents, context, encode, renderers }) => {
        const firstRowValue = block.value?.[0]?.value;
        let underline = '';
        if (firstRowValue?.length) {
            const underlineCells = renderBlocks({ blocks: firstRowValue, context, encode, renderers }).map((cell) => '-'.repeat(cell?.length || 0));
            underline = `| ${underlineCells.join(' | ')} |`;
        }
        return underline ? `${contents}${underline}\n` : contents;
    },
    ({ block, context, encode, renderers }) => {
        const rows = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return rows.join('\n');
    }
);
const tableHeaderCell = createBlockRenderer<TableHeaderCellBlock>(({ contents }) => contents);
const tableRow = createBlockRenderer<TableRowBlock>(
    ({ contents }) => `| ${contents} |`,
    ({ block, context, encode, renderers }) => {
        const cells = renderBlocks({ blocks: block.value || [], context, encode, renderers });
        return cells.join(' | ');
    }
);

const inlineCode = createDecoratorRenderer('`');
const inlineDelete = createDecoratorRenderer('--');
const emphasis = createDecoratorRenderer('*');
const insert = createDecoratorRenderer('++');
const keyboard = createDecoratorRenderer('::');
const mark = createDecoratorRenderer('==');

function lineBreak() {
    return `\n`;
}

lineBreak.children = function () {
    return null;
};

const strikethrough = createDecoratorRenderer('~~');
const strong = createDecoratorRenderer('**');
const subscript = createDecoratorRenderer('~');
const superscript = createDecoratorRenderer('^');
const underline = createDecoratorRenderer('***');
const variable = createDecoratorRenderer('%');

const createRenderer = createRendererFactory(
    {
        _anchor: anchor,
        _code: code,
        _component: component,
        _divider: divider,
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
    htmlEncode
);

const text = htmlEncode;

export {
    anchor,
    code,
    component,
    createRenderer,
    divider,
    emphasis,
    fragment,
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
    text,
    underline,
    variable
};

