import { FragmentBlock } from '../../../models';
import { VoidElement } from '../void-element';
import { Attributes, Element } from '../models';
import { Context } from '../context';

export class BrElement extends VoidElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setDecorator('linebreak');
    }

    appendTo(parent: Element) {
        this.popContext();

        const canAddLineBreak = this.context.canAddDecorator('linebreak');
        const fragment: FragmentBlock = {
            type: '_fragment',
            id: this.id(),
            value: canAddLineBreak ? '\n' : ' '
        };
        if (canAddLineBreak) {
            fragment.properties = this.withFriendlyId({ decorators: ['linebreak'] });
        }

        parent.append(fragment);
    }
}
