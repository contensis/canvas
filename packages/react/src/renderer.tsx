import React, { ClassType, ComponentClass, FunctionComponent, Component as ReactComponent, createContext, useContext } from 'react';
import {
    AnchorBlock,
    AssetBlock,
    Block,
    CodeBlock,
    ComponentBlock,
    DecoratorType,
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
    TableCaptionBlock, TableCellBlock,
    TableFooterBlock,
    TableHeaderBlock,
    TableHeaderCellBlock,
    TableRowBlock
} from '@contensis/canvas-types';

type Attributes = Record<string, any>;
type WithChildren = { children?: JSX.Element | undefined };

type RendererProps = { data: Block[] };
type RenderBlocksProps = { blocks: Block[] };
type RenderBlockProps<T extends Block> = { block: T };
type RenderBlockPropsWithChildren<T extends Block>
    = RenderBlockProps<T> & WithChildren & Attributes;

type RenderContentsProps = { contents: undefined | JSX.Element, fallback: JSX.Element };
type RenderTextProps = { text: string };

type DecoratorProps = { block: FragmentBlock, decorators: undefined | DecoratorType[] };

type TypedBlock<TType extends Block['type']> = Extract<Block, { type: TType }>;

type Renderer<TProps> = FunctionComponent<TProps> | ClassType<TProps, ReactComponent<TProps>, ComponentClass<TProps>>;

type BlockRenderer<T extends Block> = Renderer<RenderBlockPropsWithChildren<T>>;
type BlockRenderers = {
    [TType in Block['type']]: BlockRenderer<TypedBlock<TType>>
};


type RenderDecoratorProps = { block: FragmentBlock, decorator: undefined | DecoratorType, otherDecorators: undefined | DecoratorType[] };
type RenderDecoratorPropsWithChildren = RenderDecoratorProps & WithChildren & Attributes;

type DecoratorRenderer = Renderer<RenderDecoratorPropsWithChildren>;
type DecoratorRenderers = Record<DecoratorType, DecoratorRenderer>;

type ComponentRenderer = Renderer<RenderBlockPropsWithChildren<ComponentBlock>>;
type ComponentRenderers = Record<string, ComponentRenderer>;
type EntryRenderer = Renderer<RenderBlockPropsWithChildren<EntryBlock>>;
type EntryRenderers = Record<string, EntryRenderer>;
type AssetRenderer = Renderer<RenderBlockPropsWithChildren<AssetBlock>>;
type AssetRenderers = Record<string, AssetRenderer>;

type RendererContextValue = {
    blocks?: BlockRenderers,
    decorators?: DecoratorRenderers,
    components?: ComponentRenderers,
    entries?: EntryRenderers,
    assets?: AssetRenderers,
};

type RendererOverridesContextValue = {
    blocks?: Partial<BlockRenderers>,
    decorators?: Partial<DecoratorRenderers>,
    components?: ComponentRenderers,
    entries?: EntryRenderers,
    assets?: AssetRenderers,
};

type RendererContextProviderProps = WithChildren & RendererOverridesContextValue;

export type { BlockRenderer, RenderBlockProps, RenderBlockPropsWithChildren, RenderDecoratorProps, RenderDecoratorPropsWithChildren };

export const RendererContext = createContext<RendererContextValue>({});

/** 
 * Provides context to the <Renderer> component to return Canvas data as React components
 *
 *  @link https://www.npmjs.com/package/@contensis/canvas-react#usage
 *
 * @param blocks - Override the default rendering of Canvas content blocks
 * @param components - Render method for Contensis Components within the Canvas field
 * @param decorators - Override the rendering of HTML elements within a text field
 * 
 * @example 
 * <RenderContextProvider blocks={{ _table: Table }} components={{ banner: Banner }} decorators={{ strong: Strong }}>
 *      <Renderer data={data} />
 * </RenderContextProvider>
 * 
 */
export function RenderContextProvider(props: RendererContextProviderProps) {

    const overrideBlocks = props.blocks;
    const blocks = Object.keys(BLOCK_RENDERERS)
        .reduce((prev, type) => {
            const blockType = type as Block['type'];
            const renderer: any = overrideBlocks?.[blockType] || BLOCK_RENDERERS[blockType];
            (prev as any)[blockType] = renderer;
            return prev;
        }, {} as BlockRenderers);

    const overrideDecorators = props.decorators;
    const decorators = Object.keys(DECORATOR_RENDERERS)
        .reduce((prev, type) => {
            const decoratorType = type as DecoratorType;
            prev[decoratorType] = overrideDecorators?.[decoratorType] || DECORATOR_RENDERERS[decoratorType];
            return prev;
        }, {} as DecoratorRenderers);

    const value = { blocks, decorators, components: props.components, entries: props.entries, assets: props?.assets };

    return (
        <RendererContext.Provider value={value}>
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

function useEntries() {
    const value = useContext(RendererContext);
    return value.entries || {};
}

function useAssets() {
    const value = useContext(RendererContext);
    return value.assets || {};
}

function RenderBlock<TBlock extends Block>(props: RenderBlockProps<TBlock>) {
    const blocks = useBlocks();
    const Component = blocks[props.block.type] as BlockRenderer<TBlock>;
    return !!Component ? (<Component block={props.block} />) : null;
}

function RenderBlocks(props: RenderBlocksProps) {
    return (<>{props.blocks.map(block => <RenderBlock block={block} key={block.id} />)}</>);
}

function RenderContents(props: RenderContentsProps) {
    return (props.contents ? props.contents : props.fallback);
}

export function RenderChildren(props: RenderBlockProps<Block>) {
    const isArray = Array.isArray(props.block?.value);
    const isString = typeof props.block?.value === 'string';

    const render = () => {
        if (isArray) {
            return (<RenderBlocks blocks={props.block.value as any} />);
        } else if (isString) {
            return (<RenderText text={props.block.value as any} />);
        } else {
            return (<RenderText text={''} />);
        }
    };

    return render();
};

function RenderText(props: RenderTextProps) {
    return (<>{props.text}</>);
};

/** 
 * The default render method for processing Canvas data 
 * 
 * @link https://www.npmjs.com/package/@contensis/canvas-react#usage
 * 
 * @param data - Accepts Canvas data
 * 
 * */
export function Renderer(props: RendererProps) {
    return (<RenderBlocks blocks={props.data} />);
}

type AttributeProps = RenderBlockProps<Block>
    | RenderBlockPropsWithChildren<Block>
    | RenderDecoratorProps
    | RenderDecoratorPropsWithChildren;

function getAttributes(props: AttributeProps, extra: Record<string, any> = {}) {
    const { block, ...rest } = props;
    let { children, decorator, otherDecorators, ...attributes } = rest as Record<string, any>;
    attributes = {
        id: block?.properties?.id,
        ...extra,
        ...attributes
    };
    return attributes;
}

function WithCaption(props: WithChildren & { caption: undefined | string }) {
    return (
        !!props.caption
            ? (
                <figure>
                    {props.children}
                    <figcaption>{props.caption}</figcaption>
                </figure>
            )
            : (props.children || null)
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
        <a {...attributes}>
            <RenderContents contents={props.children} fallback={<Anchor.Children block={props.block} />} />
        </a>
    );
}

Anchor.Children = RenderBlockChildrenFactory<AnchorBlock>();

export function Asset(props: RenderBlockPropsWithChildren<AssetBlock>) {
    const contentTypeId = props?.block?.value?.sys?.contentTypeId;
    const components = useAssets();
    const AssetElement = !!contentTypeId ? components?.[contentTypeId] : undefined;
    const attributes = getAttributes(props);
    return (!!AssetElement)
        ? <AssetElement {...props} />
        : (
            <div {...attributes}>
                <RenderContents contents={props.children} fallback={<Asset.Children block={props.block} />} />
            </div>
        );
}

Asset.Children = function (props: RenderBlockProps<AssetBlock>) {
    const href = props?.block?.value?.sys?.uri;
    const entryTitle = props?.block?.value?.entryTitle || '';
    const entryDescription = props?.block?.value?.entryDescription || '';
    return (<>
        <div>
            {!!href ? <a href={href}>{entryTitle}</a> : entryTitle}
        </div>
        {!!entryDescription ? <div>{entryDescription}</div> : null}
    </>);
};

export function Code(props: RenderBlockPropsWithChildren<CodeBlock>) {
    const attributes = getAttributes(props, {
        'data-language': props.block?.value?.language
    });
    const codeAttributes = getAttributes(props, {
        className: `language-${props.block?.value?.language}`
    });
    return (
        <pre {...attributes}>
            <code {...codeAttributes}>
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
    const component = props?.block.properties?.component;
    const components = useComponents();
    const ComponentElement = !!component ? components?.[component] : undefined;

    const value = props.block.value ? JSON.stringify(props.block.value) : '';
    const attributes = getAttributes(props, {
        className: 'component',
        'data-component': props.block.properties?.component,
        'data-component-value': value,
    });

    return (!!ComponentElement)
        ? (<ComponentElement {...props} />)
        : (
            <div {...attributes}>
                <RenderContents contents={props.children} fallback={<Component.Children block={props.block} />} />
            </div>
        );
}

Component.Children = function (props: RenderBlockProps<ComponentBlock>) {
    return (<>Component: {props.block?.properties?.component}</>);
};

export function Divider(props: RenderBlockPropsWithChildren<DividerBlock>) {
    const attributes = getAttributes(props);
    return (<hr {...attributes} />);
}

Divider.Children = EmptyChildrenFactory<DividerBlock>();

export function Entry(props: RenderBlockPropsWithChildren<EntryBlock>) {
    const contentTypeId = props?.block?.value?.sys?.contentTypeId;
    const components = useEntries();
    const EntryElement = !!contentTypeId ? components?.[contentTypeId] : undefined;
    const attributes = getAttributes(props);
    return (!!EntryElement)
        ? <EntryElement {...props} />
        : (
            <div {...attributes}>
                <RenderContents contents={props.children} fallback={<Entry.Children block={props.block} />} />
            </div>
        );
}

Entry.Children = function (props: RenderBlockProps<EntryBlock>) {
    const href = props?.block?.value?.sys?.uri;
    const entryTitle = props?.block?.value?.entryTitle || '';
    const entryDescription = props?.block?.value?.entryDescription || '';
    return (<>
        <div>
            {!!href ? <a href={href}>{entryTitle}</a> : entryTitle}
        </div>
        {!!entryDescription ? <div>{entryDescription}</div> : null}
    </>);
};

export function FormContentType(_props: RenderBlockPropsWithChildren<FormContentTypeBlock>) {
    return null;
}

FormContentType.Children = function (_props: RenderBlockProps<FormContentTypeBlock>) {
    return null;
};

export function Fragment(props: RenderBlockPropsWithChildren<FragmentBlock>) {
    const hasDecorators = !!props.block?.properties?.decorators?.length;
    const decorators = props.block?.properties?.decorators;
    return (
        hasDecorators
            ? (<Decorators block={props.block} decorators={decorators}></Decorators>)
            : (<RenderContents contents={props.children} fallback={<Fragment.Children block={props.block} />} />)
    );
}

Fragment.Children = RenderBlockChildrenFactory<FragmentBlock>();

export function Heading(props: RenderBlockPropsWithChildren<HeadingBlock>) {
    const attributes = getAttributes(props);
    const render = () => {
        switch (props?.block?.properties?.level) {
            case 2: {
                return (
                    <h2 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h2>
                );
            }
            case 3: {
                return (
                    <h3 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h3>
                );
            }
            case 4: {
                return (
                    <h4 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h4>
                );
            }
            case 5: {
                return (
                    <h5 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h5>
                );
            }
            case 6: {
                return (
                    <h6 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h6>
                );
            }
            default: {
                return (
                    <h1 {...attributes}>
                        <RenderContents contents={props.children} fallback={<Heading.Children block={props.block} />} />
                    </h1>
                );
            }
        }
    };
    return render();
}

Heading.Children = RenderBlockChildrenFactory<HeadingBlock>();

export function Image(props: RenderBlockPropsWithChildren<ImageBlock>) {
    const src = props.block?.value?.asset?.sys?.uri;
    const attributes = getAttributes(props, {
        src,
        alt: props.block?.value?.altText,
        title: props?.block?.value?.caption,
    });
    return (<img {...attributes} />);
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
    const href = props?.block?.value?.sys?.uri;
    const attributes = getAttributes(props, {
        href
    });
    return (!!attributes.href
        ? (
            <a {...attributes}>
                <RenderContents contents={props.children} fallback={<InlineEntry.Children block={props.block} />} />
            </a>
        )
        : (<RenderContents contents={props.children} fallback={<InlineEntry.Children block={props.block} />} />)
    );
}

InlineEntry.Children = function (props: RenderBlockProps<InlineEntryBlock>) {
    const entryTitle = props?.block?.value?.entryTitle || '';
    return (<>{entryTitle}</>);
};

export function Link(props: RenderBlockPropsWithChildren<LinkBlock>) {
    const linkValue = props?.block?.properties?.link;
    const attributes = getAttributes(props, {
        href: linkValue?.sys?.uri,
        target: props?.block?.properties?.newTab ? '_blank' : null,
        rel: props?.block?.properties?.newTab ? 'noopener noreferrer' : null
    });
    return (!!attributes.href
        ? (
            <a {...attributes}>
                <RenderContents contents={props.children} fallback={<Link.Children block={props.block} />} />
            </a>
        )
        : (<RenderContents contents={props.children} fallback={<Link.Children block={props.block} />} />)
    );
}

Link.Children = RenderBlockChildrenFactory<LinkBlock>();

export function Liquid(props: RenderBlockPropsWithChildren<LiquidBlock>) {
    return (
        <RenderContents contents={props.children} fallback={<Liquid.Children block={props.block} />} />
    );
}

Liquid.Children = function (props: RenderBlockProps<LiquidBlock>) {
    return (<>{props.block?.value}</>);
};

export function List(props: RenderBlockPropsWithChildren<ListBlock>) {
    const isOrdered = (props.block?.properties?.listType === 'ordered');
    const attributes = getAttributes(props, {
        start: isOrdered ? props.block?.properties?.start : null,
    });
    return (isOrdered
        ? (
            <ol {...attributes}>
                <RenderContents contents={props.children} fallback={<List.Children block={props.block} />} />
            </ol>
        )
        : (
            <ul {...attributes}>
                <RenderContents contents={props.children} fallback={<List.Children block={props.block} />} />
            </ul>
        )
    );
}

List.Children = RenderBlockChildrenFactory<ListBlock>();

export function ListItem(props: RenderBlockPropsWithChildren<ListItemBlock>) {
    const attributes = getAttributes(props);
    return (
        <li {...attributes}>
            <RenderContents contents={props.children} fallback={<ListItem.Children block={props.block} />} />
        </li>
    );
}

ListItem.Children = RenderBlockChildrenFactory<ListItemBlock>();

export function Panel(props: RenderBlockPropsWithChildren<PanelBlock>) {
    const attributes = getAttributes(props, {
        className: ['panel', props.block?.properties?.panelType || 'info'].join(' ')
    });
    return (
        <aside {...attributes}>
            <RenderContents contents={props.children} fallback={<Panel.Children block={props.block} />} />
        </aside>
    );
}

Panel.Children = RenderBlockChildrenFactory<PanelBlock>();

export function Paragraph(props: RenderBlockPropsWithChildren<ParagraphBlock>) {
    const attributes = getAttributes(props, {
        className: props.block?.properties?.paragraphType
    });
    return (
        <p {...attributes}>
            <RenderContents contents={props.children} fallback={<Paragraph.Children block={props.block} />} />
        </p>
    );
}

Paragraph.Children = RenderBlockChildrenFactory<ParagraphBlock>();


export function Quote(props: RenderBlockPropsWithChildren<QuoteBlock>) {
    const attributes = getAttributes(props, {
        'cite': props.block?.properties?.url
    });
    return (
        <blockquote {...attributes}>
            <RenderContents contents={props.children} fallback={<Quote.Children block={props.block} />} />
        </blockquote>
    );
}

Quote.Children = function (props: RenderBlockProps<QuoteBlock>) {
    const source = props.block?.properties?.source;
    const citation = props.block?.properties?.citation;
    const hasChildren = !!source || !!citation;
    return (
        hasChildren
            ? (
                <>
                    <p>
                        <RenderChildren block={props.block} />
                    </p>
                    <footer>{source} {!!citation ? (<cite>{citation}</cite>) : (<></>)}</footer>
                </>
            )
            : (<RenderChildren block={props.block} />)
    );
};


export function Table(props: RenderBlockPropsWithChildren<TableBlock>) {
    const attributes = getAttributes(props);
    return (
        <table {...attributes}>
            <RenderContents contents={props.children} fallback={<Table.Children block={props.block} />} />
        </table>
    );
}

Table.Children = RenderBlockChildrenFactory<TableBlock>();

export function TableBody(props: RenderBlockPropsWithChildren<TableBodyBlock>) {
    const attributes = getAttributes(props);
    return (
        <tbody {...attributes}>
            <RenderContents contents={props.children} fallback={<TableBody.Children block={props.block} />} />
        </tbody>
    );
}

TableBody.Children = RenderBlockChildrenFactory<TableBodyBlock>();

export function TableCaption(props: RenderBlockPropsWithChildren<TableCaptionBlock>) {
    const attributes = getAttributes(props);
    return (
        <caption {...attributes}>
            <RenderContents contents={props.children} fallback={<TableCaption.Children block={props.block} />} />
        </caption>
    );
}

TableCaption.Children = RenderBlockChildrenFactory<TableCaptionBlock>();

export function TableCell(props: RenderBlockPropsWithChildren<TableCellBlock>) {
    const attributes = getAttributes(props);
    return (
        <td {...attributes}>
            <RenderContents contents={props.children} fallback={<TableCell.Children block={props.block} />} />
        </td>
    );
}

TableCell.Children = RenderBlockChildrenFactory<TableCellBlock>();

export function TableFooter(props: RenderBlockPropsWithChildren<TableFooterBlock>) {
    const attributes = getAttributes(props);
    return (
        <tfoot {...attributes}>
            <RenderContents contents={props.children} fallback={<TableFooter.Children block={props.block} />} />
        </tfoot>
    );
}

TableFooter.Children = RenderBlockChildrenFactory<TableFooterBlock>();

export function TableHeader(props: RenderBlockPropsWithChildren<TableHeaderBlock>) {
    const attributes = getAttributes(props);
    return (
        <thead {...attributes}>
            <RenderContents contents={props.children} fallback={<TableHeader.Children block={props.block} />} />
        </thead>
    );
}

TableHeader.Children = RenderBlockChildrenFactory<TableHeaderBlock>();

export function TableHeaderCell(props: RenderBlockPropsWithChildren<TableHeaderCellBlock>) {
    const attributes = getAttributes(props);
    return (
        <th {...attributes}>
            <RenderContents contents={props.children} fallback={<TableHeaderCell.Children block={props.block} />} />
        </th>
    );
}

TableHeaderCell.Children = RenderBlockChildrenFactory<TableHeaderCellBlock>();

export function TableRow(props: RenderBlockPropsWithChildren<TableRowBlock>) {
    const attributes = getAttributes(props);
    return (
        <tr {...attributes}>
            <RenderContents contents={props.children} fallback={<TableRow.Children block={props.block} />} />
        </tr>
    );
}

TableRow.Children = RenderBlockChildrenFactory<TableRowBlock>();


function Decorators(props: DecoratorProps) {
    const decorators = useDecorators();
    const remainingDecorators = !!props.decorators ? [...props.decorators] : undefined;
    const firstDecorator = !!remainingDecorators ? remainingDecorators.shift() : undefined;
    const DecoratorComponent = !!firstDecorator ? decorators[firstDecorator] : undefined;

    const render = () => {
        if (!!DecoratorComponent) {
            return (<DecoratorComponent block={props.block} decorator={firstDecorator} otherDecorators={remainingDecorators} />);
        } else if (firstDecorator) {
            return (<Decorators block={props.block} decorators={remainingDecorators} />);
        } else {
            return (<Fragment.Children block={props.block} />);
        }
    };

    return render();
}

function DecoratorChildren(props: RenderDecoratorPropsWithChildren) {
    return (<Decorators block={props.block} decorators={props.otherDecorators} />)
}

export function Abbreviation(props: RenderDecoratorPropsWithChildren) {    
    const title = props?.block?.properties?.abbreviation?.title;
    const attributes = getAttributes(props, { title });
    return (
        <abbr {...attributes}>
            <RenderContents contents={props.children} fallback={<InlineCode.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </abbr>
    );
}

Abbreviation.Children = DecoratorChildren;

export function InlineCode(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <code {...attributes}>
            <RenderContents contents={props.children} fallback={<InlineCode.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </code>
    );
}

InlineCode.Children = DecoratorChildren;

export function Delete(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <del {...attributes}>
            <RenderContents contents={props.children} fallback={<Delete.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </del>
    );
}

Delete.Children = DecoratorChildren;

export function Emphasis(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <em {...attributes}>
            <RenderContents contents={props.children} fallback={<Emphasis.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </em>
    );
}

Emphasis.Children = DecoratorChildren;

export function Insert(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <ins {...attributes}>
            <RenderContents contents={props.children} fallback={<Insert.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </ins>
    );
}

Insert.Children = DecoratorChildren;

export function Keyboard(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <kbd {...attributes}>
            <RenderContents contents={props.children} fallback={<Keyboard.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </kbd>
    );
}

Keyboard.Children = DecoratorChildren;

export function LineBreak(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (<br {...attributes} />);
}

LineBreak.Children = function (props: RenderDecoratorPropsWithChildren) {
    return (<></>)
}

export function Mark(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <mark {...attributes}>
            <RenderContents contents={props.children} fallback={<Mark.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </mark>
    );
}

Mark.Children = DecoratorChildren;

export function Strong(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <strong {...attributes}>
            <RenderContents contents={props.children} fallback={<Strong.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </strong>
    );
}

Strong.Children = DecoratorChildren;

export function Strikethrough(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <s {...attributes}>
            <RenderContents contents={props.children} fallback={<Strikethrough.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </s>
    );
}

Strikethrough.Children = DecoratorChildren;

export function Subscript(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sub {...attributes}>
            <RenderContents contents={props.children} fallback={<Subscript.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sub>
    );
}

Subscript.Children = DecoratorChildren;

export function Superscript(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <sup {...attributes}>
            <RenderContents contents={props.children} fallback={<Superscript.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </sup>
    );
}

Superscript.Children = DecoratorChildren;

export function Underline(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <u {...attributes}>
            <RenderContents contents={props.children} fallback={<Underline.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </u>
    );
}

Underline.Children = DecoratorChildren;

export function Variable(props: RenderDecoratorPropsWithChildren) {
    const attributes = getAttributes(props);
    return (
        <var {...attributes}>
            <RenderContents contents={props.children} fallback={<Variable.Children block={props.block} decorator={props.decorator} otherDecorators={props.otherDecorators} />} />
        </var>
    );
}

Variable.Children = DecoratorChildren;

const BLOCK_RENDERERS: BlockRenderers = {
    '_anchor': Anchor,
    '_asset': Asset,
    '_code': CodeWithCaption,
    '_component': Component,
    '_divider': Divider,
    '_entry': Entry,
    '_formContentType': FormContentType,
    '_fragment': Fragment,
    '_heading': Heading,
    '_image': ImageWithCaption,
    '_inlineEntry': InlineEntry,
    '_link': Link,
    '_liquid': Liquid,
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
    'abbreviation': Abbreviation,
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