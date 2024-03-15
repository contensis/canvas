import { TableCaptionBlock } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';

export class CaptionElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_tableCaption', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_tableCaption')) {
            const value = this.mergeItems(this.children);
            const tableCaption: TableCaptionBlock = {
                type: '_tableCaption',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(tableCaption);
        } else {
            super.appendTo(parent);
        }
    }
}
