import {
    AnchorComposedItem,
    CodeComposedItem,
    ComponentComposedItem,
    DividerComposedItem,
    HeadingComposedItem,
    ImageComposedItem,
    InlineEntryComposedItem,
    LinkComposedItem,
    ListComposedItem,
    ListItemComposedItem,
    PanelComposedItem,
    ParagraphComposedItem,
    TableBodyComposedItem,
    TableCaptionComposedItem,
    TableCellComposedItem,
    TableComposedItem,
    TableFooterComposedItem,
    TableHeaderCellComposedItem,
    TableHeaderComposedItem,
    TableRowComposedItem
} from '@contensis/canvas-types';
import { fragment, writeItems, createDecoratorWriter, createItemWriter, createWriterFactory, WriteComposedItemProps, getContents } from '@contensis/canvas-text';
import { htmlEncode } from './html';

const anchor = createItemWriter<AnchorComposedItem>(({ contents }) => contents);
const code = createItemWriter<CodeComposedItem>(
    ({ item, contents }) => `${'```'}${item.value?.language || ''}\n${contents}${'```'}\n\n`,
    ({ item, encode }) => encode(item?.value?.code)
);

const component = createItemWriter<ComponentComposedItem>(
    ({ item, contents, writers, context, encode }) => {
        const component = item.properties?.component;
        const writer = writers?.components?.[component];
        if (writer) {
            return writer({ item, writers, context, encode });
        } else {
            return `${contents}\n\n`;
        }
    },
    ({ item, encode }) => encode(`Component: ${item?.properties?.component}`)
);

const divider = createItemWriter<DividerComposedItem>(
    () => `---\n\n`,
    () => null
);

const heading = createItemWriter<HeadingComposedItem>(({ item, contents }) => {
    const levels: Record<number, string> = {
        1: '#',
        2: '##',
        3: '###',
        4: '####',
        5: '#####',
        6: '######'
    };
    const level = item?.properties?.level || 1;
    const tagName = levels[level] || '#';
    return `${tagName} ${contents}\n\n`;
});

const image = createItemWriter<ImageComposedItem>(
    ({ item, encode }) => {
        const src = item?.value?.asset?.sys?.uri;
        const altText = encode(item?.value?.altText || '');
        const caption = encode(item?.value?.caption || '');
        const url = caption ? `${src} "${caption}"` : src;
        return `![${altText}](${url})\n\n`;
    },
    () => null
);

const inlineEntry = createItemWriter<InlineEntryComposedItem>(
    ({ item, contents }) => {
        const href = item?.value?.sys?.uri;
        return href ? `[${contents}](${href})` : contents;
    },
    ({ item, encode }) => encode(item.value?.entryTitle || '')
);

const link = createItemWriter<LinkComposedItem>(({ item, contents }) => {
    const href = item.properties?.sys?.uri;
    return href ? `[${contents}](${href})` : contents;
});

const list = function (props: WriteComposedItemProps<ListComposedItem>, ...children: string[]) {
    const { item, context, writers, encode } = props;
    const parentList = !!context.list;
    context.list = item;
    context.indent = parentList ? context.indent + '\t' : '';
    const contents = getContents(children, () => list.children({ item, context, writers, encode }));
    return parentList ? `\n${contents}` : `${contents}\n`;
};

list.children = function (props: WriteComposedItemProps<ListComposedItem>) {
    const { item, context, encode, writers } = props;
    const isOrdered = item?.properties?.listType === 'ordered';
    const start = item?.properties?.start || 1;

    const items = writeItems({ items: item.value || [], context, encode, writers }).map((item, index) => {
        const prefix = isOrdered ? `${start + index}.` : '*';
        return `${context.indent || ''}${prefix} ${item}`;
    });

    return items.join('\n');
};

const listItem = createItemWriter<ListItemComposedItem>(({ contents }) => contents);
const panel = createItemWriter<PanelComposedItem>(({ contents }) => `${contents}\n\n`);
const paragraph = createItemWriter<ParagraphComposedItem>(({ contents }) => `${contents}\n\n`);

const table = createItemWriter<TableComposedItem>(({ contents }) => `${contents}\n`);
const tableBody = createItemWriter<TableBodyComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableCaption = createItemWriter<TableCaptionComposedItem>(() => '');
const tableCell = createItemWriter<TableCellComposedItem>(({ contents }) => contents);
const tableFooter = createItemWriter<TableFooterComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableHeader = createItemWriter<TableHeaderComposedItem>(
    ({ item, contents, context, encode, writers }) => {
        const firstRowValue = item.value?.[0]?.value;
        let underline = '';
        if (firstRowValue?.length) {
            const underlineCells = writeItems({ items: firstRowValue, context, encode, writers }).map((cell) => '-'.repeat(cell?.length || 0));
            underline = `| ${underlineCells.join(' | ')} |`;
        }
        return underline ? `${contents}${underline}\n` : contents;
    },
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableHeaderCell = createItemWriter<TableHeaderCellComposedItem>(({ contents }) => contents);
const tableRow = createItemWriter<TableRowComposedItem>(
    ({ contents }) => `| ${contents} |`,
    ({ item, context, encode, writers }) => {
        const cells = writeItems({ items: item.value || [], context, encode, writers });
        return cells.join(' | ');
    }
);

const inlineCode = createDecoratorWriter('`');
const inlineDelete = createDecoratorWriter('--');
const emphasis = createDecoratorWriter('*');
const insert = createDecoratorWriter('++');
const keyboard = createDecoratorWriter('::');
const mark = createDecoratorWriter('==');

function lineBreak() {
    return `\n`;
}

lineBreak.children = function () {
    return null;
};

const strikethrough = createDecoratorWriter('~~');
const strong = createDecoratorWriter('**');
const subscript = createDecoratorWriter('~');
const superscript = createDecoratorWriter('^');
const underline = createDecoratorWriter('***');
const variable = createDecoratorWriter('%');

const createWriter = createWriterFactory(
    {
        _anchor: anchor,
        _code: code,
        _component: component,
        _divider: divider,
        _fragment: fragment,
        _heading: heading,
        _image: image,
        _inlineEntry: inlineEntry,
        _link: link,
        _list: list,
        _listItem: listItem,
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
    inlineDelete,
    divider,
    emphasis,
    fragment,
    heading,
    image,
    inlineCode,
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
    variable,
    createWriter,
    text
};
