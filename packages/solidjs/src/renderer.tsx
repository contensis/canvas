import {
    AnchorBlock, CodeBlock, ComponentBlock, Block, DecoratorType, DividerBlock,
    FragmentBlock, HeadingBlock, ImageBlock, InlineEntryBlock, LinkBlock,
    ListBlock, ListItemBlock, PanelBlock, ParagraphBlock, QuoteBlock, TableBodyBlock,
    TableCaptionBlock, TableCellBlock, TableBlock, TableFooterBlock,
    TableHeaderCellBlock, TableHeaderBlock, TableRowBlock
} from '@contensis/canvas-types';
import { For, JSX, Match, Show, Switch, createContext, splitProps, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type Attributes = Record<string, any>;
type WithChildren = { children?: JSX.Element };

type RendererProps = { data: Block[] };
type RenderBlocksProps = { blocks: Block[] };
type RenderBlockProps<T extends Block> = { block: T };
type RenderBlockPropsWithChildren<T extends Block>
    = RenderBlockProps<T> & WithChildren & Attributes;

type RenderContentsProps = { contents: JSX.Element, fallback: JSX.Element };
type RenderTextProps = { text: string };

type DecoratorProps = { block: FragmentBlock, decorators: DecoratorType[] };

type BlockRenderer<T extends Block> = (props: RenderBlockPropsWithChildren<T>) => JSX.Element;
type BlockRenderers = Record<Block['type'], BlockRenderer<Block>>;

type RenderDecoratorProps = { block: FragmentBlock, decorator: DecoratorType, otherDecorators: DecoratorType[] };
type RenderDecoratorPropsWithChildren = RenderDecoratorProps & WithChildren & Attributes;

type DecoratorRenderer = (props: RenderDecoratorPropsWithChildren) => JSX.Element;
type DecoratorRenderers = Record<DecoratorType, DecoratorRenderer>;

type ComponentRenderer = (props: RenderBlockPropsWithChildren<ComponentBlock>) => JSX.Element;
type ComponentRenderers = Record<string, ComponentRenderer>;

type RendererContextValue = {
    blocks?: BlockRenderers,
    decorators?: DecoratorRenderers,
    components?: Partial<ComponentRenderers>
};

type RendererOverridesContextValue = {
    blocks?: Partial<BlockRenderers>,
    decorators?: Partial<DecoratorRenderers>,
    components?: Partial<ComponentRenderers>
};

type RendererContextProviderProps = { children: JSX.Element } & RendererOverridesContextValue;

export const RendererContext = createContext<RendererContextValue>({});

export function RenderContextProvider(props: RendererContextProviderProps) {
    const value = () => {
        const overrideBlocks = props.blocks;
        const blocks = Object.keys(BLOCK_RENDERERS)
            .reduce((prev, type) => {
                const blockType = type as Block['type'];
                prev[blockType] = overrideBlocks?.[blockType] || BLOCK_RENDERERS[blockType];
                return prev;
            }, {} as BlockRenderers);

        const overrideDecorators = props.decorators;
        const decorators = Object.keys(DECORATOR_RENDERERS)
            .reduce((prev, type) => {
                const decoratorType = type as DecoratorType;
                prev[decoratorType] = overrideDecorators?.[decoratorType] || DECORATOR_RENDERERS[decoratorType];
                return prev;
            }, {} as DecoratorRenderers);

        return { blocks, decorators, components: props.components };
    };
    return (
        <RendererContext.Provider value={value()}>
            {props.children}
        </RendererContext.Provider>
    );
}

function useBlocks() {
    const value = useContext(RendererContext);
    return value.blocks || BLOCK_RENDERERS;
}

function useDecorators() {
    const value = useContext(RendererContext);
    return value.decorators || DECORATOR_RENDERERS;
}

function useComponents() {
    const value = useContext(RendererContext);
    return value.components || {};
}

function RenderBlock(props: RenderBlockProps<Block>) {
    const blocks = useBlocks();
    const component = () => blocks[props.block.type];
    return (<Dynamic component={component()} block={props.block} />);
}

function RenderBlocks(props: RenderBlocksProps) {
    return (<For each={props.blocks}>{block => (<RenderBlock block={block} />)}</For>);
}

function RenderContents(props: RenderContentsProps) {
    return (
        <Show when={props.contents} fallback={props.fallback}>
            {props.contents}
        </Show>
    );
}

function RenderChildren(props: RenderBlockProps<Block>) {
    const isArray = () => Array.isArray(props.block?.value);
    const isString = () => typeof props.block?.value === 'string';
    return (
        <Switch fallback={(<RenderText text={''} />)}>
            <Match when={isArray()}>
                <RenderBlocks blocks={props.block.value as any} />
            </Match>
            <Match when={isString()}>
                <RenderText text={props.block.value as any} />
            </Match>
        </Switch>
    );
};

function RenderText(props: RenderTextProps) {
    return (<>{props.text}</>);
};

export function Renderer(props: RendererProps) {
    return (<RenderBlocks blocks={props.data} />);
}

type AttributeProps = RenderBlockProps<Block>
    | RenderBlockPropsWithChildren<Block>
    | RenderDecoratorProps
    | RenderDecoratorPropsWithChildren;

function getAttributes(props: AttributeProps, extraFn?: () => Record<string, any>): () => Record<string, any> {
    return () => {
        const [block, rest] = splitProps(props, ['block']);
        const [ignore, attributes] = splitProps(rest as Record<string, any>, ['children', 'decorator', 'otherDecorators']);
        return {
            id: block.block?.properties?.id,
            ...(extraFn?.() || {}),
            ...attributes
        }
    };
}

function WithCaption(props: { caption: string, children: JSX.Element }) {
    return (
        <Show when={!!props.caption} fallback={props.children}>
            <figure>
                {props.children}
                <figcaption>{props.caption}</figcaption>
            </figure>
        </Show>
    );
};

function RenderBlockChildrenFactory<T extends Block>() {
    return function (props: RenderBlockProps<T>) {
        return (<RenderChildren block={props.block} />);
    };
}

function EmptyChildrenFactory<T extends Block>() {
    return function (props: RenderBlockProps<T>) {
        return (<></>);
    };
}

export function Anchor(props: RenderBlockPropsWithChildren<AnchorBlock>) {
    const attributes = getAttributes(props);
    return (
        <a {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Anchor.Children block={props.block} />} />
        </a>
    );
}

Anchor.Children = RenderBlockChildrenFactory<AnchorBlock>();

export function Code(props: RenderBlockPropsWithChildren<CodeBlock>) {
    const attributes = getAttributes(props, () => ({
        'data-language': props.block?.value?.language
    }));
    const codeAttributes = () => ({ class: `language-${props.block?.value?.language}` });
    return (
        <pre {...(attributes())}>
            <code {...codeAttributes()}>
                <RenderContents contents={props.children} fallback={<Code.Children block={props.block} />} />
            </code>
        </pre>
    );
}

Code.Children = function (props: RenderBlockProps<CodeBlock>) {
    return (<>{props.block?.value?.code}</>);
};

function CodeWithCaption(props: RenderBlockPropsWithChildren<CodeBlock>) {
    return (
        <WithCaption caption={props.block?.value?.caption}>
            <Code {...props} />
        </WithCaption>
    );
}

export function Component(props: RenderBlockPropsWithChildren<ComponentBlock>) {
    const component = () => props?.block.properties?.component;
    const components = useComponents();
    const ComponentElement = () => components?.[component()];

    const value = () => props.block.value ? JSON.stringify(props.block.value) : '';
    const attributes = getAttributes(props, () => ({
        'class': 'component',
        'data-component': props.block.properties?.component,
        'data-component-value': value()
    }));

    return (
        <Show when={ComponentElement()} fallback={(
            <div {...(attributes())}>
                <RenderContents contents={props.children} fallback={<Component.Children block={props.block} />} />
            </div>
        )}>
            <Dynamic component={ComponentElement()} block={props.block} />
        </Show>
    );
}

Component.Children = function (props: RenderBlockProps<ComponentBlock>) {
    return (<>Component: {props.block?.properties?.component}</>);
};

export function Divider(props: RenderBlockPropsWithChildren<DividerBlock>) {
    const attributes = getAttributes(props);
    return (<hr {...(attributes())} />);
}

Divider.Children = EmptyChildrenFactory<DividerBlock>();

export function Fragment(props: RenderBlockPropsWithChildren<FragmentBlock>) {
    const hasDecorators = () => !!props.block?.properties?.decorators?.length;
    const decorators = () => props.block?.properties?.decorators;
    return (
        <Show when={hasDecorators()} fallback={<RenderContents contents={props.children} fallback={<Fragment.Children block={props.block} />} />}>
            <Decorators block={props.block} decorators={decorators()}></Decorators>
        </Show>
    );
}

Fragment.Children = RenderBlockChildrenFactory<FragmentBlock>();

export function Heading(props: RenderBlockPropsWithChildren<HeadingBlock>) {
    const isLevel2 = () => (props.block?.properties?.level === 2);
    const isLevel3 = () => (props.block?.properties?.level === 3);
    const isLevel4 = () => (props.block?.properties?.level === 4);
    const isLevel5 = () => (props.block?.properties?.level === 5);
    const isLevel6 = () => (props.block?.properties?.level === 6);
    const attributes = getAttributes(props);
    return (
        <Switch fallback={(
            <h1 {...(attributes())}>
                <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
            </h1>
        )}>
            <Match when={isLevel2()}>
                <h2 {...(attributes())}>
                    <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                </h2>
            </Match>
            <Match when={isLevel3()}>
                <h3 {...(attributes())}>
                    <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                </h3>
            </Match>
            <Match when={isLevel4()}>
                <h4 {...(attributes())}>
                    <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                </h4>
            </Match>
            <Match when={isLevel5()}>
                <h5 {...(attributes())}>
                    <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                </h5>
            </Match>
            <Match when={isLevel6()}>
                <h6 {...(attributes())}>
                    <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                </h6>
            </Match>
        </Switch>
    );
}

Heading.Children = RenderBlockChildrenFactory<HeadingBlock>();

export function Image(props: RenderBlockPropsWithChildren<ImageBlock>) {
    const src = () => props.block?.value?.asset?.sys?.uri;
    const attributes = getAttributes(props, () => ({
        src: src(),
        alt: props.block?.value?.altText,
        title: props?.block?.value?.caption
    }));
    return (<img {...(attributes())} />);
}

Image.Children = EmptyChildrenFactory<ImageBlock>();

function ImageWithCaption(props: RenderBlockPropsWithChildren<ImageBlock>) {
    return (
        <WithCaption caption={props.block?.value?.caption}>
            <Image {...props} />
        </WithCaption>
    );
}

export function InlineEntry(props: RenderBlockPropsWithChildren<InlineEntryBlock>) {
    const href = () => props?.block?.value?.sys?.uri;
    const attributes = getAttributes(props, () => ({
        href: href()
    }));
    return (
        <Show when={attributes().href} fallback={<RenderContents contents={props.children} fallback={<InlineEntry.Children block={props.block} />} />}>
            <a {...(attributes())}>
                <RenderContents contents={props.children} fallback={<InlineEntry.Children block={props.block} />} />
            </a>
        </Show>
    );
}

InlineEntry.Children = function (props: RenderBlockProps<InlineEntryBlock>) {
    const entryTitle = () => props?.block?.value?.entryTitle || '';
    return (<>{entryTitle()}</>);
};

export function Link(props: RenderBlockPropsWithChildren<LinkBlock>) {
    const attributes = getAttributes(props, () => {
        const linkValue = props?.block?.properties?.link;
        return {
            href: linkValue?.sys?.uri,            
            target: props?.block?.properties?.newTab ? '_blank' : null,
            rel: props?.block?.properties?.newTab ? 'noopener noreferrer': null
        };
    });
    return (
        <Show when={attributes()?.href} fallback={<RenderContents contents={props.children} fallback={<Link.Children block={props.block} />} />}>
            <a {...(attributes())}>
                <RenderContents contents={props.children} fallback={<Link.Children block={props.block} />} />
            </a>
        </Show>
    );
}

Link.Children = RenderBlockChildrenFactory<LinkBlock>();

export function List(props: RenderBlockPropsWithChildren<ListBlock>) {
    const isOrdered = () => (props.block?.properties?.listType === 'ordered');
    const attributes = getAttributes(props, () => ({
        start: isOrdered() ? props.block?.properties?.start : null
    }));
    return (
        <Show when={isOrdered()} fallback={(
            <ul {...(attributes())}>
                <RenderContents contents={props.children} fallback={<List.Children block={props.block} />} />
            </ul>
        )}>
            <ol {...(attributes())}>
                <RenderContents contents={props.children} fallback={<List.Children block={props.block} />} />
            </ol>
        </Show>
    );
}

List.Children = RenderBlockChildrenFactory<ListBlock>();

export function ListItem(props: RenderBlockPropsWithChildren<ListItemBlock>) {
    const attributes = getAttributes(props);
    return (
        <li {...(attributes())}>
            <RenderContents contents={props.children} fallback={<ListItem.Children block={props.block} />} />
        </li>
    );
}

ListItem.Children = RenderBlockChildrenFactory<ListItemBlock>();

export function Panel(props: RenderBlockPropsWithChildren<PanelBlock>) {
    const attributes = getAttributes(props, () => ({
        'class': ['panel', props.block?.properties?.panelType || 'info'].join(' ')
    }));
    return (
        <aside {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Panel.Children block={props.block} />} />
        </aside>
    );
}

Panel.Children = RenderBlockChildrenFactory<PanelBlock>();

export function Paragraph(props: RenderBlockPropsWithChildren<ParagraphBlock>) {
    const attributes = getAttributes(props, () => ({
        'class': props.block?.properties?.paragraphType
    }));
    return (
        <p {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Paragraph.Children block={props.block} />} />
        </p>
    );
}

Paragraph.Children = RenderBlockChildrenFactory<ParagraphBlock>();

export function Quote(props: RenderBlockPropsWithChildren<QuoteBlock>) {
    const attributes = getAttributes(props, () => ({
        'cite': props.block?.properties?.url
    }));
    return (
        <blockquote {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Quote.Children block={props.block} />} />
        </blockquote>
    );
}

Quote.Children = function (props: RenderBlockProps<QuoteBlock>) {
    const source = () => props.block?.properties?.source;
    const citation = () => props.block?.properties?.citation;
    const hasChildren = () => !!source() || !!citation();
    return (
        <Show when={hasChildren()} fallback={<RenderChildren block={props.block} />}>
            <p>
                <RenderChildren block={props.block} />
            </p>
            <Show when={citation()} fallback={<footer>{source()}</footer>}>
                <footer>{source()} <cite>{citation()}</cite></footer>
            </Show>
        </Show>
    );
};

export function Table(props: RenderBlockPropsWithChildren<TableBlock>) {
    const attributes = getAttributes(props);
    return (
        <table {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Table.Children block={props.block} />} />
        </table>
    );
}

Table.Children = RenderBlockChildrenFactory<TableBlock>();

export function TableBody(props: RenderBlockPropsWithChildren<TableBodyBlock>) {
    const attributes = getAttributes(props);
    return (
        <tbody {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableBody.Children block={props.block} />} />
        </tbody>
    );
}

TableBody.Children = RenderBlockChildrenFactory<TableBodyBlock>();

export function TableCaption(props: RenderBlockPropsWithChildren<TableCaptionBlock>) {
    const attributes = getAttributes(props);
    return (
        <caption {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableCaption.Children block={props.block} />} />
        </caption>
    );
}

TableCaption.Children = RenderBlockChildrenFactory<TableCaptionBlock>();

export function TableCell(props: RenderBlockPropsWithChildren<TableCellBlock>) {
    const attributes = getAttributes(props);
    return (
        <td {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableCell.Children block={props.block} />} />
        </td>
    );
}

TableCell.Children = RenderBlockChildrenFactory<TableCellBlock>();

export function TableFooter(props: RenderBlockPropsWithChildren<TableFooterBlock>) {
    const attributes = getAttributes(props);
    return (
        <tfoot {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableFooter.Children block={props.block} />} />
        </tfoot>
    );
}

TableFooter.Children = RenderBlockChildrenFactory<TableFooterBlock>();

export function TableHeader(props: RenderBlockPropsWithChildren<TableHeaderBlock>) {
    const attributes = getAttributes(props);
    return (
        <thead {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableHeader.Children block={props.block} />} />
        </thead>
    );
}

TableHeader.Children = RenderBlockChildrenFactory<TableHeaderBlock>();

export function TableHeaderCell(props: RenderBlockPropsWithChildren<TableHeaderCellBlock>) {
    const attributes = getAttributes(props);
    return (
        <th {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableHeaderCell.Children block={props.block} />} />
        </th>
    );
}

TableHeaderCell.Children = RenderBlockChildrenFactory<TableHeaderCellBlock>();

export function TableRow(props: RenderBlockPropsWithChildren<TableRowBlock>) {
    const attributes = getAttributes(props);
    return (
        <tr {...(attributes())}>
            <RenderContents contents={props.children} fallback={<TableRow.Children block={props.block} />} />
        </tr>
    );
}

TableRow.Children = RenderBlockChildrenFactory<TableRowBlock>();


function Decorators(props: DecoratorProps) {
    const decorators = useDecorators();
    const firstDecorator = () => {
        return !!props.decorators ? ([...props.decorators]).shift() : null;
    };
    const remainingDecorators = () => {
        let decorators = props?.decorators;
        if (decorators) {
            decorators = [...decorators];
            decorators.shift();
        }
        return !!decorators ? decorators : null;
    };
    const decoratorComponent = () => {
        const decorator = firstDecorator();
        return !!decorator ? decorators[decorator] : null;
    };
    return (
        <Switch fallback={<Fragment.Children block={props.block} />}>
            <Match when={decoratorComponent()}>
                <Dynamic component={decoratorComponent()} block={props.block} decorator={firstDecorator()} otherDecorators={remainingDecorators()} />
            </Match>
            <Match when={firstDecorator()}>
                <Decorators block={props.block} decorators={remainingDecorators()} />
            </Match>
        </Switch>
    );
}

function DecoratorChildren(props: RenderDecoratorPropsWithChildren) {
    return (<Decorators block={props.block} decorators={props.otherDecorators} />)
}

export function InlineCode(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <code {...(attributes())}>
            <RenderContents contents={props.children} fallback={<InlineCode.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </code>
    );
}

InlineCode.Children = DecoratorChildren;

export function Delete(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <del {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Delete.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </del>
    );
}

Delete.Children = DecoratorChildren;

export function Emphasis(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <em {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Emphasis.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </em>
    );
}

Emphasis.Children = DecoratorChildren;

export function Insert(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <ins {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Insert.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </ins>
    );
}

Insert.Children = DecoratorChildren;

export function Keyboard(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <kbd {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Keyboard.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </kbd>
    );
}

Keyboard.Children = DecoratorChildren;

export function LineBreak(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (<br {...(attributes())} />);
}

LineBreak.Children = function (props: RenderDecoratorPropsWithChildren) {
    return (<></>)
}

export function Mark(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <mark {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Mark.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </mark>
    );
}

Mark.Children = DecoratorChildren;

export function Strong(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <strong {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Strong.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </strong>
    );
}

Strong.Children = DecoratorChildren;

export function Strikethrough(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <s {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Strikethrough.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </s>
    );
}

Strikethrough.Children = DecoratorChildren;

export function Subscript(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sub {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Subscript.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sub>
    );
}

Subscript.Children = DecoratorChildren;

export function Superscript(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sup {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Superscript.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sup>
    );
}

Superscript.Children = DecoratorChildren;

export function Underline(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <u {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Underline.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </u>
    );
}

Underline.Children = DecoratorChildren;

export function Variable(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <var {...(attributes())}>
            <RenderContents contents={props.children} fallback={<Variable.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </var>
    );
}

Variable.Children = DecoratorChildren;


const BLOCK_RENDERERS: BlockRenderers = {
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
    '_quote': Quote,
    '_table': Table,
    '_tableBody': TableBody,
    '_tableCaption': TableCaption,
    '_tableCell': TableCell,
    '_tableFooter': TableFooter,
    '_tableHeader': TableHeader,
    '_tableHeaderCell': TableHeaderCell,
    '_tableRow': TableRow,
};

const DECORATOR_RENDERERS: DecoratorRenderers = {
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