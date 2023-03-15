import { useContext, createContext } from 'react';
import {
    ComposedItem, ComposedItemTypeMap, AnchorComposedItem, CodeComposedItem, ComponentComposedItem, DividerComposedItem, FragmentComposedItem,
    HeadingComposedItem, ImageComposedItem, InlineEntryComposedItem, ListComposedItem, ListItemComposedItem, ParagraphComposedItem,
    TableComposedItem, TableHeaderComposedItem, TableBodyComposedItem, TableFooterComposedItem, TableRowComposedItem, TableHeaderCellComposedItem,
    TableCellComposedItem, TableCaptionComposedItem, PanelComposedItem, DecoratorType, DecoratorTypeMap, LinkComposedItem, ComposedItemType
} from '@contensis/canvas-types';

type Attributes = Record<string, any>;
type WithChildren = { children?: JSX.Element };

type WriterProps = { data: ComposedItem[] };
type WriteComposedItemsProps = { items: ComposedItem[] };
type WriteComposedItemProps<T extends ComposedItem> = { item: T };
type WriteComposedItemPropsWithChildren<T extends ComposedItem>
    = WriteComposedItemProps<T> & WithChildren & Attributes;

type WriteContentsProps = { contents: JSX.Element, fallback: JSX.Element };
type WriteTextProps = { text: string };

type DecoratorProps = { item: FragmentComposedItem, decorators: DecoratorType[] };

type ComposedItemWriter<T extends ComposedItem> = (props: WriteComposedItemPropsWithChildren<T>) => JSX.Element;
type ComposedItemWriters = ComposedItemTypeMap<ComposedItemWriter<ComposedItem>>;

type WriteDecoratorProps = { item: FragmentComposedItem, decorator: DecoratorType, otherDecorators: DecoratorType[] };
type WriteDecoratorPropsWithChildren = WriteDecoratorProps & WithChildren & Attributes;

type DecoratorWriter = (props: WriteDecoratorPropsWithChildren) => JSX.Element;
type DecoratorWriters = DecoratorTypeMap<DecoratorWriter>;

type ComponentItemWriter = (props: WriteComposedItemPropsWithChildren<ComponentComposedItem>) => JSX.Element;
type ComponentItemWriters = Record<string, ComponentItemWriter>;

type WriterContextValue = {
    items?: ComposedItemWriters,
    decorators?: DecoratorWriters,
    components?: Partial<ComponentItemWriters>
};

type WriterOverridesContextValue = {
    items?: Partial<ComposedItemWriters>,
    decorators?: Partial<DecoratorWriters>,
    components?: Partial<ComponentItemWriters>
};

type WriterContextProviderProps = { children: JSX.Element } & WriterOverridesContextValue;

export const WriterContext = createContext<WriterContextValue>({});

export function WriteContextProvider(props: WriterContextProviderProps) {
    const overrideItems = props.items;
    const items = Object.keys(ITEM_WRITERS)
        .reduce((prev, type) => {
            const itemType = type as ComposedItemType;
            prev[itemType] = overrideItems?.[itemType] || ITEM_WRITERS[itemType];
            return prev;
        }, {} as ComposedItemWriters);

    const overrideDecorators = props.decorators;
    const decorators = Object.keys(DECORATOR_WRITERS)
        .reduce((prev, type) => {
            const decoratorType = type as DecoratorType;
            prev[decoratorType] = overrideDecorators?.[decoratorType] || DECORATOR_WRITERS[decoratorType];
            return prev;
        }, {} as DecoratorWriters);

    const value = { items, decorators, components: props.components };

    return (
        <WriterContext.Provider value={value}>
            {props.children}
        </WriterContext.Provider>
    );
}

function useItems() {
    const value = useContext(WriterContext);
    return value.items || ITEM_WRITERS;
}

function useDecorators() {
    const value = useContext(WriterContext);
    return value.decorators || DECORATOR_WRITERS;
}

function useComponents() {
    const value = useContext(WriterContext);
    return value.components || {};
}

function WriteItem(props: WriteComposedItemProps<ComposedItem>) {
    const items = useItems();
    const Component = items[props.item.type];
    return (<Component item={props.item} />);
}

function WriteItems(props: WriteComposedItemsProps) {
    return (<>{props.items.map(item => <WriteItem item={item} key={item.id} />)}</>);
}

function WriteContents(props: WriteContentsProps) {
    return (props.contents ? props.contents : props.fallback);
}

function WriteChildren(props: WriteComposedItemProps<ComposedItem>) {
    const isArray = Array.isArray(props.item?.value);
    const isString = typeof props.item?.value === 'string';

    const render = () => {
        if (isArray) {
            return (<WriteItems items={props.item.value as any} />);
        } else if (isString) {
            return (<WriteText text={props.item.value as any} />);
        } else {
            return (<WriteText text={''} />);
        }
    };

    return render();
};

function WriteText(props: WriteTextProps) {
    return (<>{props.text}</>);
};

export function Writer(props: WriterProps) {
    return (<WriteItems items={props.data} />);
}

type AttributeProps = WriteComposedItemProps<ComposedItem>
    | WriteComposedItemPropsWithChildren<ComposedItem>
    | WriteDecoratorProps
    | WriteDecoratorPropsWithChildren;

function getAttributes(props: AttributeProps, extra: Record<string, any> = {}) {
    const { item, ...rest } = props;
    let { children, decorator, otherDecorators, ...attributes } = rest as Record<string, any>;
    attributes = {
        id: item?.properties?.id,
        ...extra,
        ...attributes
    };
    return attributes;
}

function WithCaption(props: { caption: string, children: JSX.Element }) {
    return (
        !!props.caption
            ? (
                <figure>
                    {props.children}
                    <figcaption>{props.caption}</figcaption>
                </figure>
            )
            : props.children
    );
};

function WriteComposedItemChildrenFactory<T extends ComposedItem>() {
    return function (props: WriteComposedItemProps<T>) {
        return (<WriteChildren item={props.item} />);
    };
}

function EmptyChildrenFactory<T extends ComposedItem>() {
    return function (props: WriteComposedItemProps<T>) {
        return (<></>);
    };
}

export function Anchor(props: WriteComposedItemPropsWithChildren<AnchorComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <a {...attributes}>
            <WriteContents contents={props.children} fallback={<Anchor.Children item={props.item} />} />
        </a>
    );
}

Anchor.Children = WriteComposedItemChildrenFactory<AnchorComposedItem>();

export function Code(props: WriteComposedItemPropsWithChildren<CodeComposedItem>) {
    const attributes = getAttributes(props, {
        'data-language': props.item?.value?.language
    });
    const codeAttributes = getAttributes(props, {
        className: `language-${props.item?.value?.language}`
    });
    return (
        <pre {...attributes}>
            <code {...codeAttributes}>
                <WriteContents contents={props.children} fallback={<Code.Children item={props.item} />} />
            </code>
        </pre>
    );
}

Code.Children = function (props: WriteComposedItemProps<CodeComposedItem>) {
    return (<>{props.item?.value?.code}</>);
};

function CodeWithCaption(props: WriteComposedItemPropsWithChildren<CodeComposedItem>) {
    return (
        <WithCaption caption={props.item?.value?.caption}>
            <Code {...props} />
        </WithCaption>
    );
}

export function Component(props: WriteComposedItemPropsWithChildren<ComponentComposedItem>) {    
    const component = props?.item.properties?.component;
    const components = useComponents();
    const ComponentElement = components?.[component];

    const value = props.item.value ? JSON.stringify(props.item.value) : '';
    const attributes = getAttributes(props, {
        className: 'component',
        'data-component': props.item.properties?.component,
        'data-component-value': value,
    });

    return (!!ComponentElement)
        ? (<ComponentElement {...props} />)
        : (
            <div {...attributes}>
                <WriteContents contents={props.children} fallback={<Component.Children item={props.item} />} />
            </div>
        );
}

Component.Children = function (props: WriteComposedItemProps<ComponentComposedItem>) {
    return (<>Component: {props.item?.properties?.component}</>);
};

export function Divider(props: WriteComposedItemPropsWithChildren<DividerComposedItem>) {
    const attributes = getAttributes(props);
    return (<hr {...attributes} />);
}

Divider.Children = EmptyChildrenFactory<DividerComposedItem>();

export function Fragment(props: WriteComposedItemPropsWithChildren<FragmentComposedItem>) {
    const hasDecorators = !!props.item?.properties?.decorators?.length;
    const decorators = props.item?.properties?.decorators;
    return (
        hasDecorators
            ? (<Decorators item={props.item} decorators={decorators}></Decorators>)
            : (<WriteContents contents={props.children} fallback={<Fragment.Children item={props.item} />} />)
    );
}

Fragment.Children = WriteComposedItemChildrenFactory<FragmentComposedItem>();

export function Heading(props: WriteComposedItemPropsWithChildren<HeadingComposedItem>) {
    const attributes = getAttributes(props);
    const render = () => {
        switch (props?.item?.properties?.level) {
            case 2: {
                return (
                    <h2 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h2>
                );
            }
            case 3: {
                return (
                    <h3 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h3>
                );
            }
            case 4: {
                return (
                    <h4 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h4>
                );
            }
            case 5: {
                return (
                    <h5 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h5>
                );
            }
            case 6: {
                return (
                    <h6 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h6>
                );
            }
            default: {
                return (
                    <h1 {...attributes}>
                        <WriteContents contents={props.children} fallback={<Heading.Children item={props.item} />} />
                    </h1>
                );
            }
        }
    };
    return render();
}

Heading.Children = WriteComposedItemChildrenFactory<HeadingComposedItem>();

export function Image(props: WriteComposedItemPropsWithChildren<ImageComposedItem>) {
    const src = props.item?.value?.asset?.sys?.uri || props.item?.value?.url;
    const attributes = getAttributes(props, {
        src,
        alt: props.item?.value?.altText,
        title: props?.item?.value?.caption,
    });
    return (<img {...attributes} />);
}

Image.Children = EmptyChildrenFactory<ImageComposedItem>();

function ImageWithCaption(props: WriteComposedItemPropsWithChildren<ImageComposedItem>) {
    return (
        <WithCaption caption={props.item?.value?.caption}>
            <Image {...props} />
        </WithCaption>
    );
}

export function InlineEntry(props: WriteComposedItemPropsWithChildren<InlineEntryComposedItem>) {
    const href = props?.item?.value?.sys?.uri;
    const attributes = getAttributes(props, {
        href
    });
    return (!!href
        ? (
            <a {...attributes}>
                <WriteContents contents={props.children} fallback={<InlineEntry.Children item={props.item} />} />
            </a>
        )
        : (<WriteContents contents={props.children} fallback={<InlineEntry.Children item={props.item} />} />)
    );
}

InlineEntry.Children = function (props: WriteComposedItemProps<InlineEntryComposedItem>) {
    const entryTitle = props?.item?.value?.entryTitle || '';
    return (<>{entryTitle}</>);
};

export function Link(props: WriteComposedItemPropsWithChildren<LinkComposedItem>) {
    const value = props?.item?.properties;
    const href = value?.node?.path
        || value?.entry?.sys?.uri
        || value?.url
        || (value?.anchor ? `#${value.anchor}` : null);
    const attributes = getAttributes(props, {
        href,
        target: props?.item?.properties?.newTab ? '_blank' : null
    });
    return (!!href
        ? (
            <a {...attributes}>
                <WriteContents contents={props.children} fallback={<Link.Children item={props.item} />} />
            </a>
        )
        : (<WriteContents contents={props.children} fallback={<Link.Children item={props.item} />} />)
    );
}

Link.Children = WriteComposedItemChildrenFactory<LinkComposedItem>();

export function List(props: WriteComposedItemPropsWithChildren<ListComposedItem>) {
    const isOrdered = (props.item?.properties?.listType === 'ordered');
    const attributes = getAttributes(props, {
        start: isOrdered ? props.item?.properties?.start : null,
    });
    return (isOrdered
        ? (
            <ol {...attributes}>
                <WriteContents contents={props.children} fallback={<List.Children item={props.item} />} />
            </ol>
        )
        : (
            <ul {...attributes}>
                <WriteContents contents={props.children} fallback={<List.Children item={props.item} />} />
            </ul>
        )
    );
}

List.Children = WriteComposedItemChildrenFactory<ListComposedItem>();

export function ListItem(props: WriteComposedItemPropsWithChildren<ListItemComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <li {...attributes}>
            <WriteContents contents={props.children} fallback={<ListItem.Children item={props.item} />} />
        </li>
    );
}

ListItem.Children = WriteComposedItemChildrenFactory<ListItemComposedItem>();

export function Panel(props: WriteComposedItemPropsWithChildren<PanelComposedItem>) {
    const attributes = getAttributes(props, {
        className: ['panel', props.item?.properties?.panelType || 'info'].join(' ')
    });
    return (
        <aside {...attributes}>
            <WriteContents contents={props.children} fallback={<Panel.Children item={props.item} />} />
        </aside>
    );
}

Panel.Children = WriteComposedItemChildrenFactory<PanelComposedItem>();

export function Paragraph(props: WriteComposedItemPropsWithChildren<ParagraphComposedItem>) {
    const attributes = getAttributes(props, {
        className: props.item?.properties?.paragraphType
    });
    return (
        <p {...attributes}>
            <WriteContents contents={props.children} fallback={<Paragraph.Children item={props.item} />} />
        </p>
    );
}

Paragraph.Children = WriteComposedItemChildrenFactory<ParagraphComposedItem>();

export function Table(props: WriteComposedItemPropsWithChildren<TableComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <table {...attributes}>
            <WriteContents contents={props.children} fallback={<Table.Children item={props.item} />} />
        </table>
    );
}

Table.Children = WriteComposedItemChildrenFactory<TableComposedItem>();

export function TableBody(props: WriteComposedItemPropsWithChildren<TableBodyComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <tbody {...attributes}>
            <WriteContents contents={props.children} fallback={<TableBody.Children item={props.item} />} />
        </tbody>
    );
}

TableBody.Children = WriteComposedItemChildrenFactory<TableBodyComposedItem>();

export function TableCaption(props: WriteComposedItemPropsWithChildren<TableCaptionComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <caption {...attributes}>
            <WriteContents contents={props.children} fallback={<TableCaption.Children item={props.item} />} />
        </caption>
    );
}

TableCaption.Children = WriteComposedItemChildrenFactory<TableCaptionComposedItem>();

export function TableCell(props: WriteComposedItemPropsWithChildren<TableCellComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <td {...attributes}>
            <WriteContents contents={props.children} fallback={<TableCell.Children item={props.item} />} />
        </td>
    );
}

TableCell.Children = WriteComposedItemChildrenFactory<TableCellComposedItem>();

export function TableFooter(props: WriteComposedItemPropsWithChildren<TableFooterComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <tfoot {...attributes}>
            <WriteContents contents={props.children} fallback={<TableFooter.Children item={props.item} />} />
        </tfoot>
    );
}

TableFooter.Children = WriteComposedItemChildrenFactory<TableFooterComposedItem>();

export function TableHeader(props: WriteComposedItemPropsWithChildren<TableHeaderComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <thead {...attributes}>
            <WriteContents contents={props.children} fallback={<TableHeader.Children item={props.item} />} />
        </thead>
    );
}

TableHeader.Children = WriteComposedItemChildrenFactory<TableHeaderComposedItem>();

export function TableHeaderCell(props: WriteComposedItemPropsWithChildren<TableHeaderCellComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <th {...attributes}>
            <WriteContents contents={props.children} fallback={<TableHeaderCell.Children item={props.item} />} />
        </th>
    );
}

TableHeaderCell.Children = WriteComposedItemChildrenFactory<TableHeaderCellComposedItem>();

export function TableRow(props: WriteComposedItemPropsWithChildren<TableRowComposedItem>) {
    const attributes = getAttributes(props);
    return (
        <tr {...attributes}>
            <WriteContents contents={props.children} fallback={<TableRow.Children item={props.item} />} />
        </tr>
    );
}

TableRow.Children = WriteComposedItemChildrenFactory<TableRowComposedItem>();


function Decorators(props: DecoratorProps) {
    const decorators = useDecorators();
    const remainingDecorators = !!props.decorators ? [...props.decorators] : null;
    const firstDecorator = !!remainingDecorators ? remainingDecorators.shift() : null;
    const DecoratorComponent = !!firstDecorator ? decorators[firstDecorator] : null;

    const render = () => {
        if (!!DecoratorComponent) {
            return (<DecoratorComponent item={props.item} decorator={firstDecorator} otherDecorators={remainingDecorators} />);
        } else if (firstDecorator) {
            return (<Decorators item={props.item} decorators={remainingDecorators} />);
        } else {
            return (<Fragment.Children item={props.item} />);
        }
    };

    return render();
}

function DecoratorChildren(props: WriteDecoratorPropsWithChildren) {
    return (<Decorators item={props.item} decorators={props.otherDecorators} />)
}

export function InlineCode(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <code {...attributes}>
            <WriteContents contents={props.children} fallback={<InlineCode.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </code>
    );
}

InlineCode.Children = DecoratorChildren;

export function Delete(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <del {...attributes}>
            <WriteContents contents={props.children} fallback={<Delete.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </del>
    );
}

Delete.Children = DecoratorChildren;

export function Emphasis(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <em {...attributes}>
            <WriteContents contents={props.children} fallback={<Emphasis.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </em>
    );
}

Emphasis.Children = DecoratorChildren;

export function Insert(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <ins {...attributes}>
            <WriteContents contents={props.children} fallback={<Insert.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </ins>
    );
}

Insert.Children = DecoratorChildren;

export function Keyboard(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <kbd {...attributes}>
            <WriteContents contents={props.children} fallback={<Keyboard.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </kbd>
    );
}

Keyboard.Children = DecoratorChildren;

export function LineBreak(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (<br {...attributes} />);
}

LineBreak.Children = function (props: WriteDecoratorPropsWithChildren) {
    return (<></>)
}

export function Mark(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <mark {...attributes}>
            <WriteContents contents={props.children} fallback={<Mark.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </mark>
    );
}

Mark.Children = DecoratorChildren;

export function Strong(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <strong {...attributes}>
            <WriteContents contents={props.children} fallback={<Strong.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </strong>
    );
}

Strong.Children = DecoratorChildren;

export function Strikethrough(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <s {...attributes}>
            <WriteContents contents={props.children} fallback={<Strikethrough.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </s>
    );
}

Strikethrough.Children = DecoratorChildren;

export function Subscript(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sub {...attributes}>
            <WriteContents contents={props.children} fallback={<Subscript.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sub>
    );
}

Subscript.Children = DecoratorChildren;

export function Superscript(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sup {...attributes}>
            <WriteContents contents={props.children} fallback={<Superscript.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sup>
    );
}

Superscript.Children = DecoratorChildren;

export function Underline(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <u {...attributes}>
            <WriteContents contents={props.children} fallback={<Underline.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </u>
    );
}

Underline.Children = DecoratorChildren;

export function Variable(props: WriteDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <var {...attributes}>
            <WriteContents contents={props.children} fallback={<Variable.Children item={props.item} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </var>
    );
}

Variable.Children = DecoratorChildren;


const ITEM_WRITERS: ComposedItemWriters = {
    '_anchor': Anchor,
    '_code': CodeWithCaption,
    '_component': Component,
    '_divider': Divider,
    '_fragment': Fragment,
    '_heading': Heading,
    '_image': ImageWithCaption,
    '_inlineEntry': InlineEntry,
    '_link': Link,
    '_list': List,
    '_listItem': ListItem,
    '_panel': Panel,
    '_paragraph': Paragraph,
    '_table': Table,
    '_tableBody': TableBody,
    '_tableCaption': TableCaption,
    '_tableCell': TableCell,
    '_tableFooter': TableFooter,
    '_tableHeader': TableHeader,
    '_tableHeaderCell': TableHeaderCell,
    '_tableRow': TableRow,
};

const DECORATOR_WRITERS: DecoratorWriters = {
    'code': InlineCode,
    'delete': Delete,
    'emphasis': Emphasis,
    'insert': Insert,
    'keyboard': Keyboard,
    'linebreak': LineBreak,
    'mark': Mark,
    'strikethrough': Strikethrough,
    'strong': Strong,
    'subscript': Subscript,
    'superscript': Superscript,
    'underline': Underline,
    'variable': Variable
};