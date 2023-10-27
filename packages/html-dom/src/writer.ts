import { ComposedItem } from '@contensis/canvas-types';
import {
    ComponentItemWriters as DomComponentItemWriters,
    ComposedItemWriters as DomComposedItemWriters,
    DecoratorWriters as DomDecoratorWriters,
    WriteComposedItemProps as DomWriteComposedItemProps,
    WriteDecoratorProps as DomWriteDecoratorProps,
    createWriterFactory,
    DecoratorWriter as DomDecoratorWriter,
    ComponentItemWriter as DomComponentItemWriter,
    ComposedItemWriter as DomComposedItemWriter,
    createElements
} from '@contensis/canvas-dom';
import { h } from './dom';

const createWriter = createWriterFactory(h, h.fragment, h.text);

type HtmlFragment = typeof h.fragment;
type WriteComposedItemProps<T extends ComposedItem> = DomWriteComposedItemProps<T, Node, HtmlFragment>;
type WriteDecoratorProps = DomWriteDecoratorProps<Node, HtmlFragment>;
type ComposedItemWriters = DomComposedItemWriters<Node, HtmlFragment>;
type DecoratorWriters = DomDecoratorWriters<Node, HtmlFragment>;
type ComponentItemWriters = DomComponentItemWriters<Node, HtmlFragment>;
type ComposedItemWriter<T extends ComposedItem> = DomComposedItemWriter<T, Node, HtmlFragment>;
type DecoratorWriter = DomDecoratorWriter<Node, HtmlFragment>;
type ComponentItemWriter = DomComponentItemWriter<Node, HtmlFragment>;

const { 
    anchor, code, component, divider, fragment, heading, image, inlineEntry, link, list, listItem, panel, paragraph,
    table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell, tableRow,
    inlineCode, inlineDelete, emphasis, insert, keyboard, lineBreak, mark, strikethrough, strong, subscript, superscript,
    underline, variable
} = createElements<Node, HtmlFragment>();

const text = h.text;

export {
    ComponentItemWriter, ComponentItemWriters, ComposedItemWriter, ComposedItemWriters, DecoratorWriter, DecoratorWriters,
    WriteComposedItemProps,
    WriteDecoratorProps,
    anchor, code, component, createWriter, divider, emphasis, fragment, h, heading, image, inlineCode, inlineDelete,
    inlineEntry, insert, keyboard, lineBreak, link, list, listItem, mark, panel, paragraph, strikethrough, strong,
    subscript, superscript, table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell,
    tableRow, underline, variable, text
};