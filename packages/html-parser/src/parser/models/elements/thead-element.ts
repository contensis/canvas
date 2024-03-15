import { TableHeaderBlock, isTableRow } from '../../../models';
import { Attributes, Element } from '../models';
import { Context } from '../context';
import { BlockElement } from '../block-element';

export class TheadElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableHeader', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableHeader')) {
            const value = this.mergeItems(this.children).filter(isTableRow);
            const tableHeader: TableHeaderBlock = {
                type: '_tableHeader',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(tableHeader);
        } else {
            super.appendTo(parent);
        }
    }
}
