import { BlockElement } from '../block-element';
import { Element } from '../models';
import { toText } from '../shared';
import { BlockquoteElement } from './blockquote-element';
import { FigureElement } from './figure-element';

export class CiteElement extends BlockElement {
    appendTo(parent: Element) {
        const quoteElement = this.context.getParent('_quote');
        if (quoteElement instanceof BlockquoteElement) {
            const citation = toText(this.children, true);
            quoteElement.setCitation(citation);
        } else {
            const figureElement = this.context.getAncestor(FigureElement);
            if (
                figureElement &&
                figureElement instanceof FigureElement &&
                figureElement.withCaptionElement &&
                figureElement.withCaptionElement instanceof BlockquoteElement
            ) {
                const citation = toText(this.children, true);
                figureElement.withCaptionElement.setCitation(citation);
            } else {
                super.appendTo(parent);
            }
        }
    }
}
