import {
    ComponentItemWriter as DomComponentItemWriter,
    ComponentItemWriters as DomComponentItemWriters,
    ComposedItemWriter as DomComposedItemWriter,
    ComposedItemWriterWithChildren as DomComposedItemWriterWithChildren,
    ComposedItemWriters as DomComposedItemWriters,
    DecoratorWriter as DomDecoratorWriter,
    DecoratorWriterWithChildren as DomDecoratorWriterWithChildren,
    DecoratorWriters as DomDecoratorWriters,
    WriteComposedItemProps as DomWriteComposedItemProps,
    WriteDecoratorProps as DomWriteDecoratorProps,
    createElements,
    createWriterFactory
} from '@contensis/canvas-dom';
import { ComposedItem } from '@contensis/canvas-types';
import { attr, h } from './html';

const createWriter = createWriterFactory(h, h.fragment, h.text);

type HtmlFragment = typeof h.fragment;
type WriteComposedItemProps<T extends ComposedItem> = DomWriteComposedItemProps<T, string, HtmlFragment>;
type WriteDecoratorProps = DomWriteDecoratorProps<string, HtmlFragment>;
type ComposedItemWriters = DomComposedItemWriters<string, HtmlFragment>;
type DecoratorWriters = DomDecoratorWriters<string, HtmlFragment>;
type ComponentItemWriters = DomComponentItemWriters<string, HtmlFragment>;
type ComposedItemWriter<T extends ComposedItem> = DomComposedItemWriter<T, string, HtmlFragment>;
type DecoratorWriter = DomDecoratorWriter<string, HtmlFragment>;
type ComponentItemWriter = DomComponentItemWriter<string, HtmlFragment>;
type ComposedItemWriterWithChildren<T extends ComposedItem> = DomComposedItemWriterWithChildren<T, string, HtmlFragment>;
type DecoratorWriterWithChildren = DomDecoratorWriterWithChildren<string, HtmlFragment>;

const { 
    anchor, code, component, divider, fragment, heading, image, inlineEntry, link, list, listItem, panel, paragraph,
    table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell, tableRow,
    inlineCode, inlineDelete, emphasis, insert, keyboard, lineBreak, mark, strikethrough, strong, subscript, superscript,
    underline, variable
} = createElements<string, HtmlFragment>();

const text = h.text;

export {
    ComponentItemWriter, ComponentItemWriters, ComposedItemWriter, ComposedItemWriterWithChildren, ComposedItemWriters,
    DecoratorWriter, DecoratorWriterWithChildren, DecoratorWriters, WriteComposedItemProps, WriteDecoratorProps,
    anchor, attr, code, component, createWriter, divider, emphasis, fragment, h, heading, image, inlineCode, inlineDelete,
    inlineEntry, insert, keyboard, lineBreak, link, list, listItem, mark, panel, paragraph, strikethrough, strong,
    subscript, superscript, table, tableBody, tableCaption, tableCell, tableFooter, tableHeader, tableHeaderCell,
    tableRow, text, underline, variable
};

