import { BlockElement } from '../block-element';
import { Element } from '../models';
import { toText } from '../shared';
import { FigureElement } from './figure-element';

export class FigCaptionElement extends BlockElement {
    appendTo(parent: Element) {
        if (parent instanceof FigureElement) {
            const caption = toText(this.children, true);
            parent.setCaption(caption);
        }
        super.appendTo(parent);
    }
}
