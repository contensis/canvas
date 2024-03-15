import { BlockElement } from '../block-element';
import { Element } from '../models';
import { toText } from '../shared';
import { BlockquoteElement } from './blockquote-element';

export class FooterElement extends BlockElement {
    appendTo(parent: Element) {
        if (parent instanceof BlockquoteElement) {
            const source = toText(this.children, true);
            parent.setSource(source);
        } else {
            super.appendTo(parent);
        }
    }
}
