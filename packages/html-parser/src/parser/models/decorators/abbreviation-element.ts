import { FragmentBlock } from '../../../models';
import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class AbbreviationElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('abbreviation', name, attributes, context);
    }

    getProperties(): Partial<FragmentBlock['properties']> {
        const title = this.attributes?.title;
        return title ? { abbreviation: { title } } : {};
    }
}
