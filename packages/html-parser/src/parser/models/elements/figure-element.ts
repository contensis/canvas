import { Block } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';

export type WithCaptionElement = {
    withCaption: (caption: string) => Block;
};

export class FigureElement extends BlockElement {
    withCaptionElement: WithCaptionElement;

    private _caption: string;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.push(this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.withCaptionElement) {
            const item = this.withCaptionElement.withCaption(this._caption);
            parent.append(item);
        } else {
            super.appendTo(parent);
        }
    }

    setWithCaption(withCaptionElement: WithCaptionElement) {
        this.withCaptionElement = withCaptionElement;
    }

    setCaption(caption: string) {
        this._caption = caption;
    }
}
