import {
    AnchorBlock,
    AssetBlock,
    Block,
    CodeBlock,
    ComponentBlock,
    DividerBlock,
    EntryBlock,
    FormContentTypeBlock,
    FragmentBlock,
    HeadingBlock,
    ImageBlock,
    InlineBlock,
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
    TableCellItemBlock,
    TableFooterBlock,
    TableHeaderBlock,
    TableHeaderCellBlock,
    TableRowBlock,
    TableSectionBlock
} from './models';

export function isAnchor(block: Block): block is AnchorBlock {
    return block?.type === '_anchor';
}

export function isAsset(block: Block): block is AssetBlock {
    return block?.type === '_asset';
}

export function isCode(block: Block): block is CodeBlock {
    return block?.type === '_code';
}

export function isComponent(block: Block): block is ComponentBlock {
    return block?.type === '_component';
}

export function isDivider(block: Block): block is DividerBlock {
    return block?.type === '_divider';
}

export function isEntry(block: Block): block is EntryBlock {
    return block?.type === '_entry';
}

export function isFormContentType(block: Block): block is FormContentTypeBlock {
    return block?.type === '_formContentType';
}

export function isFragment(block: Block): block is FragmentBlock {
    return block?.type === '_fragment';
}

export function isHeading(block: Block): block is HeadingBlock {
    return block?.type === '_heading';
}

export function isImage(block: Block): block is ImageBlock {
    return block?.type === '_image';
}

export function isInlineEntry(block: Block): block is InlineEntryBlock {
    return block?.type === '_inlineEntry';
}

export function isLink(block: Block): block is LinkBlock {
    return block?.type === '_link';
}

export function isList(block: Block): block is ListBlock {
    return block?.type === '_list';
}

export function isListItem(block: Block): block is ListItemBlock {
    return block?.type === '_listItem';
}

export function isPanel(block: Block): block is PanelBlock {
    return block?.type === '_panel';
}

export function isParagraph(block: Block): block is ParagraphBlock {
    return block?.type === '_paragraph';
}

export function isQuote(block: Block): block is QuoteBlock {
    return block?.type === '_quote';
}

export function isTable(block: Block): block is TableBlock {
    return block?.type === '_table';
}

export function isTableBody(block: Block): block is TableBodyBlock {
    return block?.type === '_tableBody';
}

export function isTableCaption(block: Block): block is TableCaptionBlock {
    return block?.type === '_tableCaption';
}

export function isTableCell(block: Block): block is TableCellBlock {
    return block?.type === '_tableCell';
}

export function isTableCellItem(block: Block): block is TableCellItemBlock {
    return isTableCell(block) || isTableHeaderCell(block);
}

export function isTableFooter(block: Block): block is TableFooterBlock {
    return block?.type === '_tableFooter';
}

export function isTableHeader(block: Block): block is TableHeaderBlock {
    return block?.type === '_tableHeader';
}

export function isTableHeaderCell(block: Block): block is TableHeaderCellBlock {
    return block?.type === '_tableHeaderCell';
}

export function isTableRow(block: Block): block is TableRowBlock {
    return block?.type === '_tableRow';
}

export function isTableSection(block: Block): block is TableSectionBlock {
    return isTableBody(block) || isTableFooter(block) || isTableHeader(block);
}

export function isTableItem(block: Block) {
    return isTable(block) || isTableCaption(block) || isTableSection(block) || isTableRow(block) || isTableCellItem(block);
}

type SimpleFragment = { type: '_fragment'; id: string; value: string };

export function isSimpleFragment(block: Block): block is SimpleFragment {
    return isFragment(block) && typeof block.value === 'string' && (!block.properties || !Object.keys(block.properties).length);
}

export function isInline(block: Block): block is InlineBlock {
    return isInlineType(block?.type);
}

export function isInlineType(type: Block['type']) {
    return type === '_anchor' || type === '_fragment' || type === '_link' || type === '_inlineEntry';
}

export function isMergeableFragment(block: Block): block is FragmentBlock {
    return isFragment(block) && !block?.properties?.id;
}

export function isVoid(block: Block): block is DividerBlock {
    return isDivider(block);
}

export function isVoidInline(block: Block): block is AnchorBlock | InlineEntryBlock {
    return isAnchor(block) || isInlineEntry(block);
}
