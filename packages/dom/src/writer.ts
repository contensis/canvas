import {
    AnchorComposedItem,
    CodeComposedItem,
    ComponentComposedItem,
    ComposedItem,
    DecoratorType,
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
    TableBodyComposedItem,
    TableCaptionComposedItem,
    TableCellComposedItem,
    TableComposedItem,
    TableFooterComposedItem,
    TableHeaderCellComposedItem,
    TableHeaderComposedItem,
    TableRowComposedItem
} from '@contensis/canvas-types';

type Props = Record<string, any>;
type H<T, TFragment> = (type: string | TFragment, props: Props, ...children: T[]) => T;
type HText<T> = (text: string | number | boolean) => T;

type Attributes = Record<string, any>;
type WriteContext = Record<string, any>;
type WithContext = { context: WriteContext };
type WithH<TNode, TFragment> = {
    h: H<TNode, TFragment>;
    hFragment: TFragment;
    hText: HText<TNode>;
};
type Writers<TNode, TFragment> = {
    items: ComposedItemWriters<TNode, TFragment>;
    decorators: DecoratorWriters<TNode, TFragment>;
    components: ComponentItemWriters<TNode, TFragment>;
};
type WithWriters<TNode, TFragment> = {
    writers: Writers<TNode, TFragment>;
};

type WriterProps = { data: ComposedItem[]; context?: WriteContext };
type WriteComposedItemsProps<TNode, TFragment> = { items: ComposedItem[] } & WithContext & WithH<TNode, TFragment> & WithWriters<TNode, TFragment>;
type WriteComposedItemProps<T extends ComposedItem, TNode, TFragment> = { item: T } & WithContext &
    Attributes &
    WithH<TNode, TFragment> &
    WithWriters<TNode, TFragment>;
type WriteDecoratorProps<TNode, TFragment> = { item: FragmentComposedItem; decorator: DecoratorType; otherDecorators: DecoratorType[] } & WithH<
    TNode,
    TFragment
> &
    WithWriters<TNode, TFragment> &
    WithContext &
    Attributes;
type WriteTextProps<TNode, TFragment> = { text: string } & WithContext & WithH<TNode, TFragment>;

type AttributeProps<TNode, TFragment> = WriteComposedItemProps<ComposedItem, TNode, TFragment> | WriteDecoratorProps<TNode, TFragment>;

type ComposedItemWriter<T extends ComposedItem, TNode, TFragment> = (props: WriteComposedItemProps<T, TNode, TFragment>, ...children: TNode[]) => TNode;
type ComposedItemWriters<TNode, TFragment> = Record<ComposedItem['type'], ComposedItemWriter<ComposedItem, TNode, TFragment>>;
type DecoratorWriter<TNode, TFragment> = (props: WriteDecoratorProps<TNode, TFragment>, ...children: TNode[]) => TNode;
type DecoratorWriters<TNode, TFragment> = Record<DecoratorType, DecoratorWriter<TNode, TFragment>>;
type DecoratorProps<TNode, TFragment> = { item: FragmentComposedItem; decorators: DecoratorType[] } & WithContext &
    WithH<TNode, TFragment> &
    WithWriters<TNode, TFragment>;

type ComponentItemWriter<TNode, TFragment> = (props: WriteComposedItemProps<ComponentComposedItem, TNode, TFragment>, ...children: TNode[]) => TNode;
type ComponentItemWriters<TNode, TFragment> = Record<string, ComponentItemWriter<TNode, TFragment>>;

type WriterOverrides<TNode, TFragment> = {
    items?: Partial<ComposedItemWriters<TNode, TFragment>>;
    decorators?: Partial<DecoratorWriters<TNode, TFragment>>;
    components?: Partial<ComponentItemWriters<TNode, TFragment>>;
};
type WriteFunction<TNode> = (props: WriterProps) => TNode;

type ComposedItemWriterWithChildren<T extends ComposedItem, TNode, TFragment> = ComposedItemWriter<T, TNode, TFragment> & {
    children: (props: WriteComposedItemProps<T, TNode, TFragment>) => TNode;
}

type DecoratorWriterWithChildren<TNode, TFragment> = DecoratorWriter<TNode, TFragment> & {
    children: (props: WriteDecoratorProps<TNode, TFragment>) => TNode;
};

function isPopulated(value: any) {
    return !(value === null || typeof value === 'undefined');
}

function getAttributes<TNode, TFragment>(props: AttributeProps<TNode, TFragment>, extra: Record<string, any> = {}) {
    const { context: _context, h: _h, hFragment: _hFragment, hText: _hText, item, writers: _writers, ...rest } = props;
    let { decorator: _decorator, otherDecorators: _otherDecorators, ...attributes } = rest as Record<string, any>;
    attributes = {
        id: item?.properties?.id,
        ...(extra || {}),
        ...attributes
    };
    attributes = Object.keys(attributes)
        .filter((key) => isPopulated(attributes[key]))
        .reduce((prev, key) => ({ ...prev, [key]: attributes[key] }), {} as Record<string, any>);
    return attributes;
}

function getChildren<TNode>(children: TNode | TNode[], defaultChildren: () => TNode | TNode[]) {
    const isEmptyChildren = !children || (Array.isArray(children) && !children.length);
    children = isEmptyChildren ? defaultChildren() : children;
    return Array.isArray(children) ? children : [children];
}

function writeChildren<TNode, TFragment>(props: WriteComposedItemProps<ComposedItem, TNode, TFragment>) {
    const { item, context, writers, h, hFragment, hText } = props;
    const isArray = Array.isArray(item?.value);
    const isString = typeof item?.value === 'string';
    if (isArray) {
        return toFragment({ h, hFragment, hText }, writeItems({ items: item.value as any, context, writers, h, hFragment, hText }));
    } else if (isString) {
        return writeText({ text: item.value as any, context, h, hFragment, hText });
    } else {
        return writeText({ text: '', context, h, hFragment, hText });
    }
}

function write<TNode, TFragment>(props: WriteComposedItemsProps<TNode, TFragment>) {
    let { items, context, writers, h, hFragment, hText } = props;
    context = newContext(context || {}, true);
    return toFragment(props, writeItems({ items, context, writers, h, hFragment, hText }));
}

function writeItems<TNode, TFragment>(props: WriteComposedItemsProps<TNode, TFragment>) {
    const { items, context, writers, h, hFragment, hText } = props;
    return items.map((item) => writeItem({ item, context, writers, h, hFragment, hText }));
}

function writeItem<TNode, TFragment>(props: WriteComposedItemProps<ComposedItem, TNode, TFragment>) {
    let { item, context, writers, h, hFragment, hText } = props;
    const writer = writers.items[item.type];
    context = newContext(context);
    return writer({ item, context, writers, h, hFragment, hText });
}

function writeText<TNode, TFragment>(props: WriteTextProps<TNode, TFragment>) {
    const { text, hText } = props;
    return toFragment(props, [hText(text)]);
}

function toFragment<TNode, TFragment>(props: WithH<TNode, TFragment>, children: TNode[]) {
    const { h, hFragment } = props;
    return h(hFragment, {}, ...children);
}

function newContext(parent: WriteContext, isRoot?: boolean) {
    const context: WriteContext = Object.create(parent);
    if (isRoot) {
        context.$root = context;
    } else {
        context.$parent = parent;
    }
    return context;
}

function withCaption<TNode, TFragment>(props: WithH<TNode, TFragment>, caption: string | undefined, ...children: TNode[]) {
    const { h, hText } = props;
    return h('figure', {}, ...children, h('figcaption', {}, hText(caption)));
}

function writeDecorators<TNode, TFragment>(props: DecoratorProps<TNode, TFragment>): TNode {
    let { item, decorators, context, writers, h, hFragment, hText } = props;
    const remainingDecorators = decorators ? [...decorators] : null;
    const firstDecorator = remainingDecorators ? remainingDecorators.shift() : null;
    const decorator = firstDecorator ? writers?.decorators?.[firstDecorator] : null;

    if (decorator) {
        context = newContext(context);
        return decorator({
            item,
            context,
            decorator: firstDecorator as DecoratorType,
            otherDecorators: remainingDecorators as DecoratorType[],
            writers,
            h,
            hFragment,
            hText
        });
    } else if (firstDecorator) {
        context = newContext(context);
        return writeDecorators({ item, context, decorators: remainingDecorators as DecoratorType[], writers, h, hFragment, hText });
    } else {
        return fragment.children({ item, context, writers, h, hFragment, hText });
    }
}

function childWriter<T extends ComposedItem>() {
    return function <TNode, TFragment>(props: WriteComposedItemProps<T, TNode, TFragment>) {
        return writeChildren(props);
    };
}

function createItemWriter<T extends ComposedItem>(tagName: string | ((item: T) => string), itemAttributes?: (item: T) => Record<string, any>) {
    const result = function <TNode, TFragment>(props: WriteComposedItemProps<T, TNode, TFragment>, ...children: TNode[]) {
        const { item, context, writers, h, hFragment, hText } = props;
        const attributes = itemAttributes ? getAttributes(props, itemAttributes(item)) : getAttributes(props);
        const tag = typeof tagName === 'function' ? tagName(item) : tagName;
        return h(tag, attributes, ...getChildren(children, () => result.children({ item, context, writers, h, hFragment, hText })));
    };

    result.children = childWriter<T>();

    return result;
}

function createDecoratorWriter(tagName: string) {
    const result = function <TNode, TFragment>(props: WriteDecoratorProps<TNode, TFragment>, ...children: TNode[]) {
        const attributes = getAttributes(props);
        const { item, context, decorator, otherDecorators, writers, h, hFragment, hText } = props;
        return h(
            tagName,
            attributes,
            ...getChildren(children, () => result.children({ item, context, decorator, otherDecorators, writers, h, hFragment, hText }))
        );
    };

    result.children = function <TNode, TFragment>(props: WriteDecoratorProps<TNode, TFragment>) {
        const { item, context, otherDecorators, writers, h, hFragment, hText } = props;
        return writeDecorators({ item, context, decorators: otherDecorators, writers, h, hFragment, hText });
    };

    return result;
}

const anchor = createItemWriter<AnchorComposedItem>('a');

function code<TNode, TFragment>(props: WriteComposedItemProps<CodeComposedItem, TNode, TFragment>, ...children: TNode[]) {
    const { item, context, writers, h, hFragment, hText } = props;
    const attributes = getAttributes(props, {
        'data-language': item?.value?.language
    });
    const codeAttributes = { className: `language-${item?.value?.language}` };
    return h('pre', attributes, h('code', codeAttributes, ...getChildren(children, () => code.children({ item, context, writers, h, hFragment, hText }))));
}

function codeWithCaption<TNode, TFragment>(props: WriteComposedItemProps<CodeComposedItem, TNode, TFragment>) {
    const { item } = props;
    const caption = item?.value?.caption;
    if (caption) {
        return withCaption(props, caption, code(props));
    } else {
        return code(props);
    }
}

code.children = function <TNode, TFragment>(props: WriteComposedItemProps<CodeComposedItem, TNode, TFragment>) {
    const { hText } = props;
    return toFragment(props, [hText(props.item?.value?.code)]);
};

function component<TNode, TFragment>(props: WriteComposedItemProps<ComponentComposedItem, TNode, TFragment>, ...children: TNode[]) {
    const { item, context, writers, h, hFragment, hText } = props;
    const writer = writers?.components?.[item.properties?.component];
    if (writer) {
        return writer(props);
    } else {
        const value = item.value ? JSON.stringify(item.value) : '';
        const attributes = getAttributes(props, {
            className: 'component',
            'data-component': item.properties?.component,
            'data-component-value': value
        });
        return h('div', attributes, ...getChildren(children, () => component.children({ item, context, writers, h, hFragment, hText })));
    }
}

component.children = function <TNode, TFragment>(props: WriteComposedItemProps<ComponentComposedItem, TNode, TFragment>) {
    const { hText } = props;
    return toFragment(props, [hText(`Component: ${props.item?.properties?.component}`)]);
};

function divider<TNode, TFragment>(props: WriteComposedItemProps<DividerComposedItem, TNode, TFragment>) {
    const { h } = props;
    const attributes = getAttributes(props);
    return h('hr', attributes);
}

divider.children = function <TNode, TFragment>(_props: WriteComposedItemProps<DividerComposedItem, TNode, TFragment>) {
    return null;
};

function fragment<TNode, TFragment>(props: WriteComposedItemProps<FragmentComposedItem, TNode, TFragment>, ...children: TNode[]) {
    const { item, context, writers, h, hFragment, hText } = props;
    const hasDecorators = !!item?.properties?.decorators?.length;
    const decorators = item?.properties?.decorators as DecoratorType[];
    return hasDecorators
        ? writeDecorators({ item, decorators, context, writers, h, hFragment, hText })
        : toFragment(
            props,
            getChildren(children, () => fragment.children({ item, context, writers, h, hFragment, hText }))
        );
}

fragment.children = childWriter<FragmentComposedItem>();

const heading = createItemWriter<HeadingComposedItem>((item) => {
    const levels: Record<number, string> = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6'
    };
    return (item?.properties?.level && levels[item?.properties?.level]) || 'h1';
});

function image<TNode, TFragment>(props: WriteComposedItemProps<ImageComposedItem, TNode, TFragment>) {
    const { item, h } = props;
    const src = item?.value?.asset?.sys?.uri;
    const attributes = getAttributes(props, {
        src,
        alt: item?.value?.altText,
        title: item?.value?.caption
    });
    return h('img', attributes);
}

function imageWithCaption<TNode, TFragment>(props: WriteComposedItemProps<ImageComposedItem, TNode, TFragment>) {
    const { item } = props;
    const caption = item?.value?.caption;
    if (caption) {
        return withCaption(props, caption, image(props));
    } else {
        return image(props);
    }
}

image.children = function <TNode, TFragment>(_props: WriteComposedItemProps<ImageComposedItem, TNode, TFragment>) {
    return null;
};

function inlineEntry<TNode, TFragment>(props: WriteComposedItemProps<InlineEntryComposedItem, TNode, TFragment>, ...children: TNode[]) {
    const { item, context, writers, h, hFragment, hText } = props;
    const href = item?.value?.sys?.uri;
    const attributes = getAttributes(props, { href });
    children = getChildren(children, () => inlineEntry.children({ item, context, writers, h, hFragment, hText }));
    return href ? h('a', attributes, ...children) : toFragment(props, children);
}

inlineEntry.children = function <TNode, TFragment>(props: WriteComposedItemProps<InlineEntryComposedItem, TNode, TFragment>) {
    const { hText } = props;
    const entryTitle = props?.item?.value?.entryTitle || '';
    return toFragment(props, [hText(entryTitle)]);
};

function link<TNode, TFragment>(props: WriteComposedItemProps<LinkComposedItem, TNode, TFragment>, ...children: TNode[]) {
    const { item, context, writers, h, hFragment, hText } = props;
    const value = props?.item?.properties;
    const href = value?.sys?.uri || (value?.anchor ? `#${value.anchor}` : null);
    const attributes = getAttributes(props, {
        href,
        target: props?.item?.properties?.newTab ? '_blank' : null
    });
    children = getChildren(children, () => link.children({ item, context, writers, h, hFragment, hText }));
    return href ? h('a', attributes, ...children) : toFragment(props, children);
}

link.children = childWriter<LinkComposedItem>();

const list = createItemWriter<ListComposedItem>(
    (item) => (item?.properties?.listType === 'ordered' ? 'ol' : 'ul'),
    (item) => ({
        start: item?.properties?.listType === 'ordered' ? item?.properties?.start : null
    })
);
const listItem = createItemWriter<ListItemComposedItem>('li');
const panel = createItemWriter<PanelComposedItem>('aside', (item) => ({
    className: ['panel', item?.properties?.panelType || 'info'].join(' ')
}));
const paragraph = createItemWriter<ParagraphComposedItem>('p', (item) => ({
    className: item?.properties?.paragraphType
}));
const table = createItemWriter<TableComposedItem>('table');
const tableBody = createItemWriter<TableBodyComposedItem>('tbody');
const tableCaption = createItemWriter<TableCaptionComposedItem>('caption');
const tableCell = createItemWriter<TableCellComposedItem>('td');
const tableFooter = createItemWriter<TableFooterComposedItem>('tfoot');
const tableHeader = createItemWriter<TableHeaderComposedItem>('thead');
const tableHeaderCell = createItemWriter<TableHeaderCellComposedItem>('th');
const tableRow = createItemWriter<TableRowComposedItem>('tr');

const inlineCode = createDecoratorWriter('code');
const inlineDelete = createDecoratorWriter('del');
const emphasis = createDecoratorWriter('em');
const insert = createDecoratorWriter('ins');
const keyboard = createDecoratorWriter('kbd');

function lineBreak<TNode, TFragment>(props: WriteDecoratorProps<TNode, TFragment>) {
    const { h } = props;
    const attributes = getAttributes(props);
    return h('br', attributes);
}

lineBreak.children = function <TNode, TFragment>(_props: WriteDecoratorProps<TNode, TFragment>) {
    return null;
};

const mark = createDecoratorWriter('mark');
const strong = createDecoratorWriter('strong');
const strikethrough = createDecoratorWriter('s');
const subscript = createDecoratorWriter('sub');
const superscript = createDecoratorWriter('sup');
const underline = createDecoratorWriter('u');
const variable = createDecoratorWriter('var');

function createWriterFactory<TNode, TFragment>(h: H<TNode, TFragment>, hFragment: TFragment, hText: HText<TNode>) {
    const defaultItemWriters: ComposedItemWriters<TNode, TFragment> = {
        _anchor: anchor,
        _code: codeWithCaption,
        _component: component,
        _divider: divider,
        _fragment: fragment,
        _heading: heading,
        _image: imageWithCaption,
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
    };
    const defaultDecoratorWriters: DecoratorWriters<TNode, TFragment> = {
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
    };

    return function (overrides?: WriterOverrides<TNode, TFragment>): WriteFunction<TNode> {
        const writers: Writers<TNode, TFragment> = {
            items: {
                ...defaultItemWriters,
                ...(overrides?.items || {})
            },
            decorators: {
                ...defaultDecoratorWriters,
                ...(overrides?.decorators || {})
            },
            components: overrides?.components || {}
        };

        return function (props: WriterProps) {
            const { data, context } = props;
            return write({
                items: data,
                context,
                h,
                hFragment,
                hText,
                writers
            });
        };
    };
}

function createItemElement<T extends ComposedItem, TNode, TFragment>(element: ComposedItemWriterWithChildren<T, any, any>) {
    return element as ComposedItemWriterWithChildren<T, TNode, TFragment>;
}

function createDecoratorElement<TNode, TFragment>(element: DecoratorWriterWithChildren<any, any>) {
    return element as DecoratorWriterWithChildren<TNode, TFragment>;
}

function createElements<TNode, TFragment>() {
    return {
        anchor: createItemElement<AnchorComposedItem, TNode, TFragment>(anchor),
        code: createItemElement<CodeComposedItem, TNode, TFragment>(code),
        component: createItemElement<ComponentComposedItem, TNode, TFragment>(component),
        divider: createItemElement<DividerComposedItem, TNode, TFragment>(divider),
        fragment: createItemElement<FragmentComposedItem, TNode, TFragment>(fragment),
        heading: createItemElement<HeadingComposedItem, TNode, TFragment>(heading),
        image: createItemElement<ImageComposedItem, TNode, TFragment>(image),
        inlineEntry: createItemElement<InlineEntryComposedItem, TNode, TFragment>(inlineEntry),
        link: createItemElement<LinkComposedItem, TNode, TFragment>(link),
        list: createItemElement<ListComposedItem, TNode, TFragment>(list),
        listItem: createItemElement<ListItemComposedItem, TNode, TFragment>(listItem),
        panel: createItemElement<PanelComposedItem, TNode, TFragment>(panel),
        paragraph: createItemElement<ParagraphComposedItem, TNode, TFragment>(paragraph),
        table: createItemElement<TableComposedItem, TNode, TFragment>(table),
        tableBody: createItemElement<TableBodyComposedItem, TNode, TFragment>(tableBody),
        tableCaption: createItemElement<TableCaptionComposedItem, TNode, TFragment>(tableCaption),
        tableCell: createItemElement<TableCellComposedItem, TNode, TFragment>(tableCell),
        tableFooter: createItemElement<TableFooterComposedItem, TNode, TFragment>(tableFooter),
        tableHeader: createItemElement<TableHeaderComposedItem, TNode, TFragment>(tableHeader),
        tableHeaderCell: createItemElement<TableHeaderCellComposedItem, TNode, TFragment>(tableHeaderCell),
        tableRow: createItemElement<TableRowComposedItem, TNode, TFragment>(tableRow),

        inlineCode: createDecoratorElement<TNode, TFragment>(inlineCode),
        inlineDelete: createDecoratorElement<TNode, TFragment>(inlineDelete),
        emphasis: createDecoratorElement<TNode, TFragment>(emphasis),
        insert: createDecoratorElement<TNode, TFragment>(insert),
        keyboard: createDecoratorElement<TNode, TFragment>(keyboard),
        lineBreak: createDecoratorElement<TNode, TFragment>(lineBreak),
        mark: createDecoratorElement<TNode, TFragment>(mark),
        strikethrough: createDecoratorElement<TNode, TFragment>(strikethrough),
        strong: createDecoratorElement<TNode, TFragment>(strong),
        subscript: createDecoratorElement<TNode, TFragment>(subscript),
        superscript: createDecoratorElement<TNode, TFragment>(superscript),
        underline: createDecoratorElement<TNode, TFragment>(underline),
        variable: createDecoratorElement<TNode, TFragment>(variable)
    };
}

export {
    ComponentItemWriter,
    ComponentItemWriters,
    ComposedItemWriter,
    ComposedItemWriterWithChildren,
    ComposedItemWriters,
    DecoratorWriter,
    DecoratorWriterWithChildren,
    DecoratorWriters,
    WriteComposedItemProps,
    WriteDecoratorProps, 
    createElements, 
    createWriterFactory
};

