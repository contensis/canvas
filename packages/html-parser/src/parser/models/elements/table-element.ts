import {
    Block,
    TableBodyBlock,
    TableCaptionBlock,
    TableBlock,
    TableSectionBlock,
    isTableBody,
    isTableCaption,
    isTableFooter,
    isTableHeader,
    isTableRow
} from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';

export class TableElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_table', this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.context.canAddType('_table')) {
            let children = this.mergeItems(this.children);
            children = this.trimItems(children);

            const newId = () => this.newId();
            let caption = children.find(isTableCaption);
            let tableHeader = children.find(isTableHeader);
            let tableBody = children.find(isTableBody);
            let tableFooter = children.find(isTableFooter);

            caption = caption || createTableCaption(newId);
            tableBody = tableBody || createTableBody(children, newId);

            const cellCount = getCellCount(tableHeader, tableBody, tableFooter);
            tableHeader = ensureCells(tableHeader, cellCount, newId);
            tableBody = ensureCells(tableBody, cellCount, newId);
            tableFooter = ensureCells(tableFooter, cellCount, newId);

            const value = [caption, tableHeader, tableBody, tableFooter].filter((c) => !!c);
            const table: TableBlock = {
                type: '_table',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(table);
        } else {
            super.appendTo(parent);
        }
    }
}

function createTableBody(children: Block[], newId: () => string): TableBodyBlock {
    const tableBody: TableBodyBlock = {
        type: '_tableBody',
        id: newId(),
        value: []
    };
    children.forEach((item) => {
        if (isTableBody(item)) {
            if (!tableBody.properties) {
                tableBody.properties = item.properties;
            }
            tableBody.value.push(...item.value);
        } else if (isTableRow(item)) {
            tableBody.value.push(item);
        }
    });
    return tableBody;
}

function createTableCaption(newId: () => string): TableCaptionBlock {
    return {
        id: newId(),
        type: '_tableCaption',
        value: ''
    };
}

function ensureCells<T extends TableSectionBlock>(section: T, count: number, newId: () => string): T {
    if (section) {
        const type = isTableHeader(section) ? '_tableHeaderCell' : '_tableCell';
        section.value = section.value || [];
        if (!section.value.length) {
            section.value.push({
                type: '_tableRow',
                id: newId(),
                value: []
            });
        }
        section.value.forEach((row) => {
            row.value = row.value || [];
            while (row.value.length < count) {
                row.value.push({
                    type,
                    id: newId(),
                    value: []
                });
            }
        });
    }
    return section;
}

function getCellCount(...sections: TableSectionBlock[]): number {
    const rows = sections.map((section) => section?.value || []).flat();
    const cellCounts = rows.map((block) => (Array.isArray(block.value) ? block.value.length : 0));
    return Math.max(...cellCounts);
}
