import {
    BlockRenderer as DomBlockRenderer,
    BlockRendererWithChildren as DomBlockRendererWithChildren,
    BlockRenderers as DomBlockRenderers,
    ComponentRenderer as DomComponentRenderer,
    ComponentRenderers as DomComponentRenderers,
    DecoratorRenderer as DomDecoratorRenderer,
    DecoratorRendererWithChildren as DomDecoratorRendererWithChildren,
    DecoratorRenderers as DomDecoratorRenderers,
    RenderBlockProps as DomRenderBlockProps,
    RenderDecoratorProps as DomRenderDecoratorProps,
    createElements,
    createRendererFactory
} from '@contensis/canvas-dom';
import { Block } from '@contensis/canvas-types';
import { attr, h } from './html';

const createRenderer = createRendererFactory(h, h.fragment, h.text);

type HtmlFragment = typeof h.fragment;
type RenderBlockProps<T extends Block> = DomRenderBlockProps<T, string, HtmlFragment>;
type RenderDecoratorProps = DomRenderDecoratorProps<string, HtmlFragment>;
type BlockRenderers = DomBlockRenderers<string, HtmlFragment>;
type DecoratorRenderers = DomDecoratorRenderers<string, HtmlFragment>;
type ComponentRenderers = DomComponentRenderers<string, HtmlFragment>;
type BlockRenderer<T extends Block> = DomBlockRenderer<T, string, HtmlFragment>;
type DecoratorRenderer = DomDecoratorRenderer<string, HtmlFragment>;
type ComponentRenderer = DomComponentRenderer<string, HtmlFragment>;
type BlockRendererWithChildren<T extends Block> = DomBlockRendererWithChildren<T, string, HtmlFragment>;
type DecoratorRendererWithChildren = DomDecoratorRendererWithChildren<string, HtmlFragment>;

const { 
    anchor,
    code,
    component,
    divider,
    fragment,
    heading,
    image,
    inlineEntry,
    link,
    list,
    listItem,
    quote,
    panel,
    paragraph,
    table,
    tableBody,
    tableCaption,
    tableCell,
    tableFooter,
    tableHeader,
    tableHeaderCell,
    tableRow,
    inlineCode,
    inlineDelete,
    emphasis,
    insert,
    keyboard,
    lineBreak,
    mark,
    strikethrough,
    strong,
    subscript,
    superscript,
    underline,
    variable
} = createElements<string, HtmlFragment>();

const text = h.text;

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
    anchor,
    attr,
    code,
    component,
    createRenderer,
    divider,
    emphasis,
    fragment,
    h,
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

