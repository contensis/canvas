import { Block } from '@contensis/canvas-types';
import {
    ComponentRenderers as DomComponentRenderers,
    BlockRenderers as DomBlockRenderers,
    DecoratorRenderers as DomDecoratorRenderers,
    RenderBlockProps as DomRenderBlockProps,
    RenderDecoratorProps as DomRenderDecoratorProps,
    createRendererFactory,
    DecoratorRenderer as DomDecoratorRenderer,
    ComponentRenderer as DomComponentRenderer,
    BlockRenderer as DomBlockRenderer,
    createElements
} from '@contensis/canvas-dom';
import { h } from './dom';

const createRenderer = createRendererFactory(h, h.fragment, h.text);

type HtmlFragment = typeof h.fragment;
type RenderBlockProps<T extends Block> = DomRenderBlockProps<T, Node, HtmlFragment>;
type RenderDecoratorProps = DomRenderDecoratorProps<Node, HtmlFragment>;
type BlockRenderers = DomBlockRenderers<Node, HtmlFragment>;
type DecoratorRenderers = DomDecoratorRenderers<Node, HtmlFragment>;
type ComponentRenderers = DomComponentRenderers<Node, HtmlFragment>;
type BlockRenderer<T extends Block> = DomBlockRenderer<T, Node, HtmlFragment>;
type DecoratorRenderer = DomDecoratorRenderer<Node, HtmlFragment>;
type ComponentRenderer = DomComponentRenderer<Node, HtmlFragment>;

const { 
    abbreviation, anchor, code, component, divider, fragment, heading, image, inlineEntry, link, list, listItem, panel, paragraph,
    quote, table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell, tableRow,
    inlineCode, inlineDelete, emphasis, insert, keyboard, lineBreak, mark, strikethrough, strong, subscript, superscript,
    underline, variable
} = createElements<Node, HtmlFragment>();

const text = h.text;

export type {
    ComponentRenderer, ComponentRenderers, BlockRenderer, BlockRenderers, DecoratorRenderer, DecoratorRenderers,
    RenderBlockProps,
    RenderDecoratorProps
};

export {
    abbreviation, anchor, code, component, createRenderer, divider, emphasis, fragment, h, heading, image, inlineCode, inlineDelete,
    inlineEntry, insert, keyboard, lineBreak, link, list, listItem, mark, panel, paragraph, quote, strikethrough, strong,
    subscript, superscript, table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell,
    tableRow, underline, variable, text
};