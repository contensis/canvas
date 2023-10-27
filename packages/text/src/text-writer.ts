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
import { fragment, writeItems, createDecoratorWriter, createItemWriter, createWriterFactory, WriteComposedItemProps, getContents } from './writer';

const anchor = createItemWriter<AnchorComposedItem>(({ contents }) => contents);
const code = createItemWriter<CodeComposedItem>(
    ({ contents }) => `${contents}\n`,
    ({ item, encode }) => encode(item?.value?.code)
);

const component = createItemWriter<ComponentComposedItem>(
    ({ item, contents, writers, context, encode }) => {
        const component = item.properties?.component;
        const writer = writers?.components?.[component];
        if (writer) {
            return writer({ item, writers, context, encode });
        } else {
            return `${contents}\n`;
        }
    },
    ({ item, encode }) => encode(`Component: ${item?.properties?.component}`)
);

const divider = createItemWriter<DividerComposedItem>(
    () => `\n`,
    () => null
);

const heading = createItemWriter<HeadingComposedItem>(({ contents }) => `${contents}\n`);

const image = createItemWriter<ImageComposedItem>(
    () => '',
    () => null
);

const inlineEntry = createItemWriter<InlineEntryComposedItem>(
    ({ contents }) => contents,
    ({ item, encode }) => encode(item.value?.entryTitle || '')
);

const link = createItemWriter<LinkComposedItem>(({ contents }) => contents);

const list = function (props: WriteComposedItemProps<ListComposedItem>, ...children: string[]) {
    const { item, context, writers, encode } = props;
    const parentList = !!context.list;
    context.list = item;
    const contents = getContents(children, () => list.children({ item, context, writers, encode }));
    return parentList ? `\n${contents}` : `${contents}\n`;
};

list.children = function (props: WriteComposedItemProps<ListComposedItem>) {
    const { item, context, encode, writers } = props;
    const items = writeItems({ items: item.value || [], context, encode, writers });
    return items.join('\n');
};


const listItem = createItemWriter<ListItemComposedItem>(({ contents }) => contents);
const panel = createItemWriter<PanelComposedItem>(({ contents }) => `${contents}\n`);
const paragraph = createItemWriter<ParagraphComposedItem>(({ contents }) => `${contents}\n`);

const table = createItemWriter<TableComposedItem>(({ contents }) => contents);
const tableBody = createItemWriter<TableBodyComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableCaption = createItemWriter<TableCaptionComposedItem>(({ contents }) => `${contents}\n`);
const tableCell = createItemWriter<TableCellComposedItem>(({ contents }) => contents);
const tableFooter = createItemWriter<TableFooterComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableHeader = createItemWriter<TableHeaderComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const rows = writeItems({ items: item.value || [], context, encode, writers });
        return rows.join('\n');
    }
);
const tableHeaderCell = createItemWriter<TableHeaderCellComposedItem>(({ contents }) => contents);
const tableRow = createItemWriter<TableRowComposedItem>(
    ({ contents }) => contents,
    ({ item, context, encode, writers }) => {
        const cells = writeItems({ items: item.value || [], context, encode, writers });
        return cells.join(' ');
    }
);

const inlineCode = createDecoratorWriter('');
const inlineDelete = createDecoratorWriter('');
const emphasis = createDecoratorWriter('');
const insert = createDecoratorWriter('');
const keyboard = createDecoratorWriter('');
const mark = createDecoratorWriter('');

function lineBreak() {
    return `\n`;
}

lineBreak.children = function () {
    return null;
};

const strikethrough = createDecoratorWriter('');
const strong = createDecoratorWriter('');
const subscript = createDecoratorWriter('');
const superscript = createDecoratorWriter('');
const underline = createDecoratorWriter('');
const variable = createDecoratorWriter('');

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
    (s) => `${s}`
);

export {
    anchor,
    code,
    component,
    inlineDelete,
    divider,
    emphasis,
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
    createWriter
};
