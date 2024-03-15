import { DividerBlock } from '../../../models';
import { VoidElement } from '../void-element';
import { Attributes, Element } from '../models';
import { Context } from '../context';

export class HrElement extends VoidElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_divider', this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.context.canAddType('_divider')) {
            const divider: DividerBlock = {
                type: '_divider',
                id: this.id(),
                properties: this.withFriendlyId()
            };
            parent.append(divider);
        }
    }
}
