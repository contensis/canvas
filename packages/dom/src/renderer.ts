import {
    AnchorBlock,
    Block,
    CodeBlock,
    ComponentBlock,
    DecoratorType,
    DividerBlock,
    FormContentTypeBlock,
    FragmentBlock,
    HeadingBlock,
    ImageBlock,
    InlineEntryBlock,
    LinkBlock,
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

type Props = Record<string, any>;
type H<T, TFragment> = (type: string | TFragment, props: Props, ...children: T[]) => T;
type HText<T> = (text: string | number | boolean | null | undefined) => T;

type Attributes = Record<string, any>;
type RenderContext = Record<string, any>;
type WithContext = { context?: RenderContext };
type WithH<TNode, TFragment> = {
    h: H<TNode, TFragment>;
    hFragment: TFragment;
    hText: HText<TNode>;
};
type Renderers<TNode, TFragment> = {
    blocks: BlockRenderers<TNode, TFragment>;
    decorators: DecoratorRenderers<TNode, TFragment>;
    components: ComponentRenderers<TNode, TFragment>;
};
type WithRenderers<TNode, TFragment> = {
    renderers: Renderers<TNode, TFragment>;
};

type RendererProps = { data: Block[]; context?: RenderContext };
type RenderBlocksProps<TNode, TFragment> = { blocks: Block[] } & WithContext & WithH<TNode, TFragment> & WithRenderers<TNode, TFragment>;
type RenderBlockProps<T extends Block, TNode, TFragment> = { block: T } & WithContext &
    Attributes &
    WithH<TNode, TFragment> &
    WithRenderers<TNode, TFragment>;
type RenderDecoratorProps<TNode, TFragment> = { block: FragmentBlock; decorator: DecoratorType; otherDecorators: DecoratorType[] } & WithH<
    TNode,
    TFragment
> &
    WithRenderers<TNode, TFragment> &
    WithContext &
    Attributes;
type RenderTextProps<TNode, TFragment> = { text: string } & WithContext & WithH<TNode, TFragment>;

type AttributeProps<TNode, TFragment> = RenderBlockProps<Block, TNode, TFragment> | RenderDecoratorProps<TNode, TFragment>;

type TypedBlock<TType extends Block['type']> = Extract<Block, { type: TType }>;

type BlockRenderer<T extends Block, TNode, TFragment> = (props: RenderBlockProps<T, TNode, TFragment>, ...children: TNode[]) => TNode;
type BlockRenderers<TNode, TFragment> = {
    [TType in Block['type']]: BlockRenderer<TypedBlock<TType>, TNode, TFragment>
};

type DecoratorRenderer<TNode, TFragment> = (props: RenderDecoratorProps<TNode, TFragment>, ...children: TNode[]) => TNode;
type DecoratorRenderers<TNode, TFragment> = Record<DecoratorType, DecoratorRenderer<TNode, TFragment>>;
type DecoratorProps<TNode, TFragment> = { block: FragmentBlock; decorators: DecoratorType[] } & WithContext &
    WithH<TNode, TFragment> &
    WithRenderers<TNode, TFragment>;

type ComponentRenderer<TNode, TFragment> = (props: RenderBlockProps<ComponentBlock, TNode, TFragment>, ...children: TNode[]) => TNode;
type ComponentRenderers<TNode, TFragment> = Record<string, ComponentRenderer<TNode, TFragment>>;

type RendererOverrides<TNode, TFragment> = {
    blocks?: Partial<BlockRenderers<TNode, TFragment>>;
    decorators?: Partial<DecoratorRenderers<TNode, TFragment>>;
    components?: ComponentRenderers<TNode, TFragment>;
};
type RenderFunction<TNode> = (props: RendererProps) => TNode;

type BlockRendererWithChildren<T extends Block, TNode, TFragment> = BlockRenderer<T, TNode, TFragment> & {
    children: (props: RenderBlockProps<T, TNode, TFragment>) => TNode;
};

type DecoratorRendererWithChildren<TNode, TFragment> = DecoratorRenderer<TNode, TFragment> & {
    children: (props: RenderDecoratorProps<TNode, TFragment>) => TNode;
};

function isPopulated(value: any) {
    return !(value === null || typeof value === 'undefined');
}

function getAttributes<TNode, TFragment>(props: AttributeProps<TNode, TFragment>, extra: Record<string, any> = {}) {
    const { context: _context, h: _h, hFragment: _hFragment, hText: _hText, block, renderers: _renderers, ...rest } = props;
    let { decorator: _decorator, otherDecorators: _otherDecorators, ...attributes } = rest as Record<string, any>;
    attributes = {
        id: block?.properties?.id,
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

function renderChildren<TNode, TFragment>(props: RenderBlockProps<Block, TNode, TFragment>) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const isArray = Array.isArray(block?.value);
    const isString = typeof block?.value === 'string';
    if (isArray) {
        return toFragment({ h, hFragment, hText }, renderBlocks({ blocks: block.value as any, context, renderers, h, hFragment, hText }));
    } else if (isString) {
        return renderText({ text: block.value as any, context, h, hFragment, hText });
    } else {
        return renderText({ text: '', context, h, hFragment, hText });
    }
}

function render<TNode, TFragment>(props: RenderBlocksProps<TNode, TFragment>) {
    let { blocks, context, renderers, h, hFragment, hText } = props;
    context = newContext(context || {}, true);
    return toFragment(props, renderBlocks({ blocks, context, renderers, h, hFragment, hText }));
}

function renderBlocks<TNode, TFragment>(props: RenderBlocksProps<TNode, TFragment>) {
    const { blocks, context, renderers, h, hFragment, hText } = props;
    return blocks.map((block) => renderBlock({ block, context, renderers, h, hFragment, hText }));
}

function renderBlock<TBlock extends Block, TNode, TFragment>(props: RenderBlockProps<TBlock, TNode, TFragment>) {
    let { block, context, renderers, h, hFragment, hText } = props;
    const renderer = renderers.blocks[block.type] as BlockRenderer<TBlock, TNode, TFragment>;
    context = newContext(context);
    return renderer({ block, context, renderers, h, hFragment, hText });
}

function renderText<TNode, TFragment>(props: RenderTextProps<TNode, TFragment>) {
    const { text, hText } = props;
    return toFragment(props, [hText(text)]);
}

function toFragment<TNode, TFragment>(props: WithH<TNode, TFragment>, children: TNode[]) {
    const { h, hFragment } = props;
    return h(hFragment, {}, ...children);
}

function newContext(parent: undefined | RenderContext, isRoot?: boolean) {
    const context: RenderContext = Object.create(parent || null);
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

function renderDecorators<TNode, TFragment>(props: DecoratorProps<TNode, TFragment>): TNode {
    let { block, decorators, context, renderers, h, hFragment, hText } = props;
    const remainingDecorators = decorators ? [...decorators] : null;
    const firstDecorator = remainingDecorators ? remainingDecorators.shift() : null;
    const decorator = firstDecorator ? renderers?.decorators?.[firstDecorator] : null;

    if (decorator) {
        context = newContext(context);
        return decorator({
            block,
            context,
            decorator: firstDecorator as DecoratorType,
            otherDecorators: remainingDecorators as DecoratorType[],
            renderers,
            h,
            hFragment,
            hText
        });
    } else if (firstDecorator) {
        context = newContext(context);
        return renderDecorators({ block, context, decorators: remainingDecorators as DecoratorType[], renderers, h, hFragment, hText });
    } else {
        return fragment.children({ block, context, renderers, h, hFragment, hText });
    }
}

function childRenderer<T extends Block>() {
    return function <TNode, TFragment>(props: RenderBlockProps<T, TNode, TFragment>) {
        return renderChildren(props);
    };
}

function createBlockRenderer<T extends Block>(tagName: string | ((block: T) => string), blockAttributes?: (block: T) => Record<string, any>) {
    const result = function <TNode, TFragment>(props: RenderBlockProps<T, TNode, TFragment>, ...children: TNode[]) {
        const { block, context, renderers, h, hFragment, hText } = props;
        const attributes = blockAttributes ? getAttributes(props, blockAttributes(block)) : getAttributes(props);
        const tag = typeof tagName === 'function' ? tagName(block) : tagName;
        return h(tag, attributes, ...getChildren(children, () => result.children({ block, context, renderers, h, hFragment, hText })));
    };

    result.children = childRenderer<T>();

    return result;
}

function createDecoratorRenderer(tagName: string) {
    const result = function <TNode, TFragment>(props: RenderDecoratorProps<TNode, TFragment>, ...children: TNode[]) {
        const attributes = getAttributes(props);
        const { block, context, decorator, otherDecorators, renderers, h, hFragment, hText } = props;
        return h(
            tagName,
            attributes,
            ...getChildren(children, () => result.children({ block, context, decorator, otherDecorators, renderers, h, hFragment, hText }))
        );
    };

    result.children = function <TNode, TFragment>(props: RenderDecoratorProps<TNode, TFragment>) {
        const { block, context, otherDecorators, renderers, h, hFragment, hText } = props;
        return renderDecorators({ block, context, decorators: otherDecorators, renderers, h, hFragment, hText });
    };

    return result;
}

const anchor = createBlockRenderer<AnchorBlock>('a');

function code<TNode, TFragment>(props: RenderBlockProps<CodeBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const attributes = getAttributes(props, {
        'data-language': block?.value?.language
    });
    const codeAttributes = { className: `language-${block?.value?.language}` };
    return h('pre', attributes, h('code', codeAttributes, ...getChildren(children, () => code.children({ block, context, renderers, h, hFragment, hText }))));
}

function codeWithCaption<TNode, TFragment>(props: RenderBlockProps<CodeBlock, TNode, TFragment>) {
    const { block } = props;
    const caption = block?.value?.caption;
    if (caption) {
        return withCaption(props, caption, code(props));
    } else {
        return code(props);
    }
}

code.children = function <TNode, TFragment>(props: RenderBlockProps<CodeBlock, TNode, TFragment>) {
    const { hText } = props;
    return toFragment(props, [hText(props.block?.value?.code)]);
};

function component<TNode, TFragment>(props: RenderBlockProps<ComponentBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const renderer = !!block.properties?.component ? renderers?.components?.[block.properties.component] : undefined;
    if (renderer) {
        return renderer(props);
    } else {
        const value = block.value ? JSON.stringify(block.value) : '';
        const attributes = getAttributes(props, {
            className: 'component',
            'data-component': block.properties?.component,
            'data-component-value': value
        });
        return h('div', attributes, ...getChildren(children, () => component.children({ block, context, renderers, h, hFragment, hText })));
    }
}

component.children = function <TNode, TFragment>(props: RenderBlockProps<ComponentBlock, TNode, TFragment>) {
    const { hText } = props;
    return toFragment(props, [hText(`Component: ${props.block?.properties?.component}`)]);
};

function divider<TNode, TFragment>(props: RenderBlockProps<DividerBlock, TNode, TFragment>) {
    const { h } = props;
    const attributes = getAttributes(props);
    return h('hr', attributes);
}

divider.children = function <TNode, TFragment>(_props: RenderBlockProps<DividerBlock, TNode, TFragment>) {
    return null;
};


function formContentType<TNode, TFragment>(props: RenderBlockProps<FormContentTypeBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const attributes = getAttributes(props, {
        'data-contensis-form-id': block.value?.contentType?.id
    });
    return h('div', attributes, ...getChildren(children, () => formContentType.children({ block, context, renderers, h, hFragment, hText })));
}

formContentType.children = function <TNode, TFragment>(props: RenderBlockProps<FormContentTypeBlock, TNode, TFragment>) {
    const { hText } = props;
    return toFragment(props, [hText(`Form: ${props.block?.value?.contentType?.id}`)]);
};


function fragment<TNode, TFragment>(props: RenderBlockProps<FragmentBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const hasDecorators = !!block?.properties?.decorators?.length;
    const decorators = block?.properties?.decorators as DecoratorType[];
    return hasDecorators
        ? renderDecorators({ block, decorators, context, renderers, h, hFragment, hText })
        : toFragment(
            props,
            getChildren(children, () => fragment.children({ block, context, renderers, h, hFragment, hText }))
        );
}

fragment.children = childRenderer<FragmentBlock>();

const heading = createBlockRenderer<HeadingBlock>((block) => {
    const levels: Record<number, string> = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6'
    };
    return (block?.properties?.level && levels[block?.properties?.level]) || 'h1';
});

function image<TNode, TFragment>(props: RenderBlockProps<ImageBlock, TNode, TFragment>) {
    const { block, h } = props;
    const src = block?.value?.asset?.sys?.uri;
    const attributes = getAttributes(props, {
        src,
        alt: block?.value?.altText,
        title: block?.value?.caption
    });
    return h('img', attributes);
}

function imageWithCaption<TNode, TFragment>(props: RenderBlockProps<ImageBlock, TNode, TFragment>) {
    const { block } = props;
    const caption = block?.value?.caption;
    if (caption) {
        return withCaption(props, caption, image(props));
    } else {
        return image(props);
    }
}

image.children = function <TNode, TFragment>(_props: RenderBlockProps<ImageBlock, TNode, TFragment>) {
    return null;
};

function inlineEntry<TNode, TFragment>(props: RenderBlockProps<InlineEntryBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const href = block?.value?.sys?.uri;
    const attributes = getAttributes(props, { href });
    children = getChildren(children, () => inlineEntry.children({ block, context, renderers, h, hFragment, hText }));
    return attributes.href ? h('a', attributes, ...children) : toFragment(props, children);
}

inlineEntry.children = function <TNode, TFragment>(props: RenderBlockProps<InlineEntryBlock, TNode, TFragment>) {
    const { hText } = props;
    const entryTitle = props?.block?.value?.entryTitle || '';
    return toFragment(props, [hText(entryTitle)]);
};

function link<TNode, TFragment>(props: RenderBlockProps<LinkBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const linkValue = props?.block?.properties?.link;
    const attributes = getAttributes(props, {
        href: linkValue?.sys?.uri,
        target: block?.properties?.newTab ? '_blank' : null,
        rel: block?.properties?.newTab ? 'noopener noreferrer' : null
    });
    children = getChildren(children, () => link.children({ block, context, renderers, h, hFragment, hText }));
    return attributes.href ? h('a', attributes, ...children) : toFragment(props, children);
}

link.children = childRenderer<LinkBlock>();

const list = createBlockRenderer<ListBlock>(
    (block) => (block?.properties?.listType === 'ordered' ? 'ol' : 'ul'),
    (block) => ({
        start: block?.properties?.listType === 'ordered' ? block?.properties?.start : null
    })
);
const listItem = createBlockRenderer<ListItemBlock>('li');
const panel = createBlockRenderer<PanelBlock>('aside', (block) => ({
    className: ['panel', block?.properties?.panelType || 'info'].join(' ')
}));
const paragraph = createBlockRenderer<ParagraphBlock>('p', (block) => ({
    className: block?.properties?.paragraphType
}));

function quote<TNode, TFragment>(props: RenderBlockProps<QuoteBlock, TNode, TFragment>, ...children: TNode[]) {
    const { block, context, renderers, h, hFragment, hText } = props;
    const attributes = getAttributes(props, {
        cite: props?.block?.properties?.url
    });
    children = getChildren(children, () => quote.children({ block, context, renderers, h, hFragment, hText }));
    return h('blockquote', attributes, ...children);
}

quote.children = function <TNode, TFragment>(props: RenderBlockProps<QuoteBlock, TNode, TFragment>) {
    const { block, context, h, hFragment, hText } = props;
    if (block.properties?.source || block.properties?.citation) {
        const children = renderChildren(props);
        const quote = h('p', {}, children);
        const footerChildren: TNode[] = [];
        if (block.properties.source) {
            footerChildren.push(renderText({ text: block.properties.source, context, h, hFragment, hText }));
        }
        if (block.properties.source && block.properties.citation) {
            footerChildren.push(renderText({ text: ' ', context, h, hFragment, hText }));
        }
        if (block.properties.citation) {
            footerChildren.push(h('cite', {}, renderText({ text: block.properties.citation, context, h, hFragment, hText })));
        }
        const source = h('footer', {}, ...footerChildren);
        return toFragment({ h, hFragment, hText }, [quote, source]);
    } else {
        return renderChildren(props);
    }
};

const table = createBlockRenderer<TableBlock>('table');
const tableBody = createBlockRenderer<TableBodyBlock>('tbody');
const tableCaption = createBlockRenderer<TableCaptionBlock>('caption');
const tableCell = createBlockRenderer<TableCellBlock>('td');
const tableFooter = createBlockRenderer<TableFooterBlock>('tfoot');
const tableHeader = createBlockRenderer<TableHeaderBlock>('thead');
const tableHeaderCell = createBlockRenderer<TableHeaderCellBlock>('th');
const tableRow = createBlockRenderer<TableRowBlock>('tr');

const inlineCode = createDecoratorRenderer('code');
const inlineDelete = createDecoratorRenderer('del');
const emphasis = createDecoratorRenderer('em');
const insert = createDecoratorRenderer('ins');
const keyboard = createDecoratorRenderer('kbd');

function lineBreak<TNode, TFragment>(props: RenderDecoratorProps<TNode, TFragment>) {
    const { h } = props;
    const attributes = getAttributes(props);
    return h('br', attributes);
}

lineBreak.children = function <TNode, TFragment>(_props: RenderDecoratorProps<TNode, TFragment>) {
    return null;
};

const mark = createDecoratorRenderer('mark');
const strong = createDecoratorRenderer('strong');
const strikethrough = createDecoratorRenderer('s');
const subscript = createDecoratorRenderer('sub');
const superscript = createDecoratorRenderer('sup');
const underline = createDecoratorRenderer('u');
const variable = createDecoratorRenderer('var');

function createRendererFactory<TNode, TFragment>(h: H<TNode, TFragment>, hFragment: TFragment, hText: HText<TNode>) {
    const defaultBlockRenderers: BlockRenderers<TNode, TFragment> = {
        _anchor: anchor,
        _code: codeWithCaption,
        _component: component,
        _divider: divider,
        _formContentType: formContentType,
        _fragment: fragment,
        _heading: heading,
        _image: imageWithCaption,
        _inlineEntry: inlineEntry,
        _link: link,
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
    };
    const defaultDecoratorRenderers: DecoratorRenderers<TNode, TFragment> = {
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

    return function (overrides?: RendererOverrides<TNode, TFragment>): RenderFunction<TNode> {
        const renderers: Renderers<TNode, TFragment> = {
            blocks: {
                ...defaultBlockRenderers,
                ...(overrides?.blocks || {})
            },
            decorators: {
                ...defaultDecoratorRenderers,
                ...(overrides?.decorators || {})
            },
            components: overrides?.components || {}
        };

        return function (props: RendererProps) {
            const { data, context } = props;
            return render({
                blocks: data,
                context,
                h,
                hFragment,
                hText,
                renderers
            });
        };
    };
}

function createBlockElement<T extends Block, TNode, TFragment>(element: BlockRendererWithChildren<T, any, any>) {
    return element as BlockRendererWithChildren<T, TNode, TFragment>;
}

function createDecoratorElement<TNode, TFragment>(element: DecoratorRendererWithChildren<any, any>) {
    return element as DecoratorRendererWithChildren<TNode, TFragment>;
}

function createElements<TNode, TFragment>() {
    return {
        anchor: createBlockElement<AnchorBlock, TNode, TFragment>(anchor),
        code: createBlockElement<CodeBlock, TNode, TFragment>(code),
        component: createBlockElement<ComponentBlock, TNode, TFragment>(component),
        divider: createBlockElement<DividerBlock, TNode, TFragment>(divider),
        formContentType: createBlockElement<FormContentTypeBlock, TNode, TFragment>(formContentType),
        fragment: createBlockElement<FragmentBlock, TNode, TFragment>(fragment),
        heading: createBlockElement<HeadingBlock, TNode, TFragment>(heading),
        image: createBlockElement<ImageBlock, TNode, TFragment>(image),
        inlineEntry: createBlockElement<InlineEntryBlock, TNode, TFragment>(inlineEntry),
        link: createBlockElement<LinkBlock, TNode, TFragment>(link),
        list: createBlockElement<ListBlock, TNode, TFragment>(list),
        listItem: createBlockElement<ListItemBlock, TNode, TFragment>(listItem),
        panel: createBlockElement<PanelBlock, TNode, TFragment>(panel),
        paragraph: createBlockElement<ParagraphBlock, TNode, TFragment>(paragraph),
        quote: createBlockElement<QuoteBlock, TNode, TFragment>(quote),
        table: createBlockElement<TableBlock, TNode, TFragment>(table),
        tableBody: createBlockElement<TableBodyBlock, TNode, TFragment>(tableBody),
        tableCaption: createBlockElement<TableCaptionBlock, TNode, TFragment>(tableCaption),
        tableCell: createBlockElement<TableCellBlock, TNode, TFragment>(tableCell),
        tableFooter: createBlockElement<TableFooterBlock, TNode, TFragment>(tableFooter),
        tableHeader: createBlockElement<TableHeaderBlock, TNode, TFragment>(tableHeader),
        tableHeaderCell: createBlockElement<TableHeaderCellBlock, TNode, TFragment>(tableHeaderCell),
        tableRow: createBlockElement<TableRowBlock, TNode, TFragment>(tableRow),

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

export type {
    BlockRenderer,
    BlockRendererWithChildren,
    BlockRenderers,
    ComponentRenderer,
    ComponentRenderers,
    DecoratorRenderer,
    DecoratorRendererWithChildren,
    DecoratorRenderers,
    RenderBlockProps,
    RenderDecoratorProps
};

export {
    createElements,
    createRendererFactory
};

