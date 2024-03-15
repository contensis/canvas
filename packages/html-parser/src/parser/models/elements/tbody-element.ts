import { TableBodyBlock, isTableRow } from '../../../models';
import { Attributes, Element } from '../models';
import { Context } from '../context';
import { BlockElement } from '../block-element';

export class TbodyElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableBody', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableBody')) {
            const value = this.mergeItems(this.children).filter(isTableRow);
            const tableBody: TableBodyBlock = {
                type: '_tableBody',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(tableBody);
        } else {
            super.appendTo(parent);
        }
    }
}
