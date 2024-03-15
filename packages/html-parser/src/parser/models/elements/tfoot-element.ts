import { TableFooterBlock, isTableRow } from '../../../models';
import { Attributes, Element } from '../models';
import { Context } from '../context';
import { BlockElement } from '../block-element';

export class TfootElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableFooter', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableFooter')) {
            const value = this.mergeItems(this.children).filter(isTableRow);
            const tableFooter: TableFooterBlock = {
                type: '_tableFooter',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(tableFooter);
        } else {
            super.appendTo(parent);
        }
    }
}
