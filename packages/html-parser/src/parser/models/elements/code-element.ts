import { Context } from '../context';
import { Attributes, Element } from '../models';
import { DecoratorElement } from '../decorators';
import { PreElement } from './pre-element';
import { toText } from '../shared';

export class CodeElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('code', name, attributes, context);
    }

    appendTo(parent: Element) {
        if (parent instanceof PreElement) {
            const code = toText(this.children, false);
            parent.setCode(code, this.attributes);
        }
        super.appendTo(parent);
    }
}
