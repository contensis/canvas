import { ComponentComposedItem, ComposedItem, DecoratorType, FragmentComposedItem } from '@contensis/canvas-types';

type Encode = (value: any) => string;
type WriteContext = Record<string, any>;
type WithContext = { context: WriteContext };
type WithEncode = {
    encode: Encode;
};
type Writers = {
    items: ComposedItemWriters;
    decorators: DecoratorWriters;
    components: ComponentItemWriters;
};
type WithWriters = {
    writers: Writers;
};

type WriterProps = { data: ComposedItem[]; context?: WriteContext };
type WriteComposedItemsProps = { items: ComposedItem[] } & WithContext & WithEncode & WithWriters;
type WriteComposedItemProps<T extends ComposedItem> = { item: T } & WithContext & WithEncode & WithWriters;
type WriteDecoratorProps = { item: FragmentComposedItem; decorator: DecoratorType; otherDecorators: DecoratorType[] } & WithContext & WithEncode & WithWriters;
type WriteTextProps = { text: string } & WithContext & WithEncode;

type ComposedItemWriter<T extends ComposedItem> = (props: WriteComposedItemProps<T>, ...children: string[]) => string;
type ComposedItemWriters = Record<ComposedItem['type'], ComposedItemWriter<ComposedItem>>;
type DecoratorWriter = (props: WriteDecoratorProps, ...children: string[]) => string;
type DecoratorWriters = Record<DecoratorType, DecoratorWriter>;
type DecoratorProps = { item: FragmentComposedItem; decorators: DecoratorType[] } & WithContext & WithEncode & WithWriters;
type ComponentItemWriter = (props: WriteComposedItemProps<ComponentComposedItem>, ...children: string[]) => string;
type ComponentItemWriters = Record<string, ComponentItemWriter>;

type WriterOverrides = {
    items?: Partial<ComposedItemWriters>;
    decorators?: Partial<DecoratorWriters>;
    components?: Partial<ComponentItemWriters>;
};
type WriteFunction = (props: WriterProps) => string;

function newContext(parent: WriteContext, isRoot?: boolean) {
    const context: WriteContext = Object.create(parent);
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

function write(props: WriteComposedItemsProps) {
    let { items, context, writers, encode } = props;
    context = newContext(context || {}, true);
    return concat(writeItems({ items, context, writers, encode }));
}

function writeItems(props: WriteComposedItemsProps) {
    const { items, context, writers, encode } = props;
    return items.map((item) => writeItem({ item, context, writers, encode }));
}

function writeItem(props: WriteComposedItemProps<ComposedItem>) {
    let { item, context, writers, encode } = props;
    const writer = writers.items[item.type];
    context = newContext(context);
    return writer({ item, context, writers, encode });
}

function writeText(props: WriteTextProps) {
    const { text, encode } = props;
    return encode(text);
}

function writeChildren(props: WriteComposedItemProps<ComposedItem>) {
    const { item, context, writers, encode } = props;
    const isArray = Array.isArray(item?.value);
    const isString = typeof item?.value === 'string';
    if (isArray) {
        return concat(writeItems({ items: item.value as any, context, writers, encode }));
    } else if (isString) {
        return writeText({ text: item.value as any, context, encode });
    } else {
        return writeText({ text: '', context, encode });
    }
}

function childWriter<T extends ComposedItem>() {
    return function (props: WriteComposedItemProps<T>) {
        return writeChildren(props);
    };
}

function writeDecorators(props: DecoratorProps): string {
    let { item, decorators, context, writers, encode } = props;
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
            encode
        });
    } else if (firstDecorator) {
        context = newContext(context);
        return writeDecorators({ item, context, decorators: remainingDecorators as DecoratorType[], writers, encode });
    } else {
        return fragment.children({ item, context, writers, encode });
    }
}

type ItemWriterOptions<T extends ComposedItem> = WriteComposedItemProps<T> & {
    contents: string;
};

function createItemWriter<T extends ComposedItem>(fn: (options: ItemWriterOptions<T>) => string, writeChildren?: (props: WriteComposedItemProps<T>) => string) {
    const result = function (props: WriteComposedItemProps<T>, ...children: string[]) {
        const { item, context, writers, encode } = props;
        const contents = getContents(children, () => result.children({ item, context, writers, encode }));
        return fn({ item, context, writers, encode, contents });
    };

    result.children = writeChildren || childWriter();

    return result;
}

function createDecoratorWriter(tag: string) {
    const result = function (props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators, writers, encode } = props;
        const contents = getContents(children, () => result.children({ item, context, decorator, otherDecorators, writers, encode }));
        return `${tag}${contents}${tag}`;
    };

    result.children = function (props: WriteDecoratorProps) {
        const { item, context, otherDecorators, writers, encode } = props;
        return writeDecorators({ item, context, decorators: otherDecorators, writers, encode });
    };

    return result;
}

function fragment(props: WriteComposedItemProps<FragmentComposedItem>, ...children: string[]) {
    const { item, context, writers, encode } = props;
    const hasDecorators = !!item?.properties?.decorators?.length;
    const decorators = item?.properties?.decorators as DecoratorType[];
    return hasDecorators
        ? writeDecorators({ item, decorators, context, writers, encode })
        : getContents(children, () => fragment.children({ item, context, writers, encode }));
}

fragment.children = childWriter<FragmentComposedItem>();

function createWriterFactory(defaultItemWriters: ComposedItemWriters, defaultDecoratorWriters: DecoratorWriters, encode: Encode) {
    return function (overrides?: WriterOverrides): WriteFunction {
        const writers: Writers = {
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
                writers,
                encode
            });
        };
    };
}

export {
    createWriterFactory,
    createItemWriter,
    createDecoratorWriter,
    writeItems,
    fragment,
    ComponentItemWriter,
    ComponentItemWriters,
    ComposedItemWriter,
    ComposedItemWriters,
    DecoratorWriter,
    DecoratorWriters,
    WriteComposedItemProps,
    WriteDecoratorProps,
    getContents,
    childWriter
};
