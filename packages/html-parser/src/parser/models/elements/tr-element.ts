import { TableRowBlock, isTableCellItem } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';

export class TrElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableRow', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableRow')) {
            let children = this.mergeItems(this.children);
            children = this.trimItems(children);
            const value = children.filter(isTableCellItem);
            const tableRow: TableRowBlock = {
                type: '_tableRow',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(tableRow);
        } else {
            super.appendTo(parent);
        }
    }
}
