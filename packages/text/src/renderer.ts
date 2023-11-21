import { ComponentBlock, Block, DecoratorType, FragmentBlock } from '@contensis/canvas-types';

type Encode = (value: any) => string;
type RenderContext = Record<string, any>;
type WithContext = { context: RenderContext };
type WithEncode = {
    encode: Encode;
};
type Renderers = {
    blocks: BlockRenderers;
    decorators: DecoratorRenderers;
    components: ComponentRenderers;
};
type WithRenderers = {
    renderers: Renderers;
};

type RendererProps = { data: Block[]; context?: RenderContext };
type RenderBlocksProps = { blocks: Block[] } & WithContext & WithEncode & WithRenderers;
type RenderBlockProps<T extends Block> = { block: T } & WithContext & WithEncode & WithRenderers;
type RenderDecoratorProps = { block: FragmentBlock; decorator: DecoratorType; otherDecorators: DecoratorType[] } & WithContext & WithEncode & WithRenderers;
type RenderTextProps = { text: string } & WithContext & WithEncode;

type BlockRenderer<T extends Block> = (props: RenderBlockProps<T>, ...children: string[]) => string;
type BlockRenderers = Record<Block['type'], BlockRenderer<Block>>;
type DecoratorRenderer = (props: RenderDecoratorProps, ...children: string[]) => string;
type DecoratorRenderers = Record<DecoratorType, DecoratorRenderer>;
type DecoratorProps = { block: FragmentBlock; decorators: DecoratorType[] } & WithContext & WithEncode & WithRenderers;
type ComponentRenderer = (props: RenderBlockProps<ComponentBlock>, ...children: string[]) => string;
type ComponentRenderers = Record<string, ComponentRenderer>;

type RendererOverrides = {
    blocks?: Partial<BlockRenderers>;
    decorators?: Partial<DecoratorRenderers>;
    components?: Partial<ComponentRenderers>;
};
type RenderFunction = (props: RendererProps) => string;

function newContext(parent: RenderContext, isRoot?: boolean) {
    const context: RenderContext = Object.create(parent);
    if (isRoot) {
        context.$root = context;
    } else {
        context.$parent = parent;
    }
    return context;
}

function concat(children: string[]) {
    return children.join('');
}

function getContents(children: string | string[], defaultChildren: () => string | string[]) {
    const isEmptyChildren = !children || (Array.isArray(children) && !children.length);
    children = isEmptyChildren ? defaultChildren() : children;
    return Array.isArray(children) ? children.join('') : children || '';
}

function render(props: RenderBlocksProps) {
    let { blocks, context, renderers, encode } = props;
    context = newContext(context || {}, true);
    return concat(renderBlocks({ blocks, context, renderers, encode }));
}

function renderBlocks(props: RenderBlocksProps) {
    const { blocks, context, renderers, encode } = props;
    return blocks.map((block) => renderBlock({ block, context, renderers, encode }));
}

function renderBlock(props: RenderBlockProps<Block>) {
    let { block, context, renderers, encode } = props;
    const renderer = renderers.blocks[block.type];
    context = newContext(context);
    return renderer({ block, context, renderers, encode });
}

function renderText(props: RenderTextProps) {
    const { text, encode } = props;
    return encode(text);
}

function renderChildren(props: RenderBlockProps<Block>) {
    const { block, context, renderers, encode } = props;
    const isArray = Array.isArray(block?.value);
    const isString = typeof block?.value === 'string';
    if (isArray) {
        return concat(renderBlocks({ blocks: block.value as any, context, renderers, encode }));
    } else if (isString) {
        return renderText({ text: block.value as any, context, encode });
    } else {
        return renderText({ text: '', context, encode });
    }
}

function childRenderer<T extends Block>() {
    return function (props: RenderBlockProps<T>) {
        return renderChildren(props);
    };
}

function renderDecorators(props: DecoratorProps): string {
    let { block, decorators, context, renderers, encode } = props;
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
            encode
        });
    } else if (firstDecorator) {
        context = newContext(context);
        return renderDecorators({ block, context, decorators: remainingDecorators as DecoratorType[], renderers, encode });
    } else {
        return fragment.children({ block, context, renderers, encode });
    }
}

type BlockRendererOptions<T extends Block> = RenderBlockProps<T> & {
    contents: string;
};

function createBlockRenderer<T extends Block>(fn: (options: BlockRendererOptions<T>) => string, renderChildren?: (props: RenderBlockProps<T>) => string) {
    const result = function (props: RenderBlockProps<T>, ...children: string[]) {
        const { block, context, renderers, encode } = props;
        const contents = getContents(children, () => result.children({ block, context, renderers, encode }));
        return fn({ block, context, renderers, encode, contents });
    };

    result.children = renderChildren || childRenderer();

    return result;
}

function createDecoratorRenderer(tag: string) {
    const result = function (props: RenderDecoratorProps, ...children: string[]) {
        const { block, context, decorator, otherDecorators, renderers, encode } = props;
        const contents = getContents(children, () => result.children({ block, context, decorator, otherDecorators, renderers, encode }));
        return `${tag}${contents}${tag}`;
    };

    result.children = function (props: RenderDecoratorProps) {
        const { block, context, otherDecorators, renderers, encode } = props;
        return renderDecorators({ block, context, decorators: otherDecorators, renderers, encode });
    };

    return result;
}

function fragment(props: RenderBlockProps<FragmentBlock>, ...children: string[]) {
    const { block, context, renderers, encode } = props;
    const hasDecorators = !!block?.properties?.decorators?.length;
    const decorators = block?.properties?.decorators as DecoratorType[];
    return hasDecorators
        ? renderDecorators({ block, decorators, context, renderers, encode })
        : getContents(children, () => fragment.children({ block, context, renderers, encode }));
}

fragment.children = childRenderer<FragmentBlock>();

function createRendererFactory(defaultBlockRenderers: BlockRenderers, defaultDecoratorRenderers: DecoratorRenderers, encode: Encode) {
    return function (overrides?: RendererOverrides): RenderFunction {
        const renderers: Renderers = {
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
                renderers,
                encode
            });
        };
    };
}

export {
    createRendererFactory,
    createBlockRenderer,
    createDecoratorRenderer,
    renderBlocks,
    fragment,
    ComponentRenderer,
    ComponentRenderers,
    BlockRenderer,
    BlockRenderers,
    DecoratorRenderer,
    DecoratorRenderers,
    RenderBlockProps,
    RenderDecoratorProps,
    getContents,
    childRenderer
};
