import { TableHeaderCellBlock, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';

export class ThElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableHeaderCell', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableHeaderCell')) {
            const children = this.mergeItems(this.children).filter(isInline);
            const value = this.trimItems(children);
            const tableHeaderCell: TableHeaderCellBlock = {
                type: '_tableHeaderCell',
                id: this.id(),
                properties: this.withFriendlyId(),
                value: toValue(value)
            };
            parent.append(tableHeaderCell);
        } else {
            super.appendTo(parent);
        }
    }
}
