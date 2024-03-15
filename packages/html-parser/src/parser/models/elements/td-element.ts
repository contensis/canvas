import { TableCellBlock, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';

export class TdElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableCell', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableCell')) {
            const children = this.mergeItems(this.children).filter(isInline);
            const value = this.trimItems(children);
            const tableCell: TableCellBlock = {
                type: '_tableCell',
                id: this.id(),
                properties: this.withFriendlyId(),
                value: toValue(value)
            };
            parent.append(tableCell);
        } else {
            super.appendTo(parent);
        }
    }
}
