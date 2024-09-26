import { QuoteBlock, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';
import { FigureElement } from './figure-element';

export class BlockquoteElement extends BlockElement {
    private _citation: undefined | string;
    private _source: undefined | string;
    private _quoteItem: undefined | QuoteBlock;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_quote', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_quote')) {
            const children = this.mergeItems(this.children).filter((i) => isInline(i));
            this._quoteItem = {
                type: '_quote',
                id: this.id(),
                properties: this.withFriendlyId(this.getProperties()),
                value: toValue(children) as any
            };
            if (parent instanceof FigureElement) {
                parent.setWithCaption(this);
            } else {
                parent.append(this._quoteItem);
            }
        } else {
            super.appendTo(parent);
        }
    }

    setCitation(citation: string) {
        this._citation = citation;
    }

    setSource(source: string) {
        this._source = source;
    }

    withCaption(source: string) {
        if (this._quoteItem) {
        let properties = this._quoteItem.properties;
        if (source) {
            properties = {
                ...properties,
                source
            };
        }
        if (this._citation) {
            properties = {
                ...properties,
                citation: this._citation
            };
        }
        return {
            ...this._quoteItem,
            properties
        };
        } else {
            return undefined;
        }
    }

    private getProperties(): QuoteBlock['properties'] {
        const url = this.attributes['cite'];
        return {
            url,
            citation: this._citation,
            source: this._source
        };
    }
}
