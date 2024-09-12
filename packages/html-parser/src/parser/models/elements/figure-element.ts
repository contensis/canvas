import { Block } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';

export type WithCaptionElement = {
    withCaption: (caption: string) => undefined | Block;
};

export class FigureElement extends BlockElement {
    withCaptionElement: undefined | WithCaptionElement;

    private _caption: undefined | string;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.push(this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.withCaptionElement) {
            const item = this.withCaptionElement.withCaption(this._caption || '');
            if (item) {
            parent.append(item);
            } else {
                super.appendTo(parent);
            }
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
