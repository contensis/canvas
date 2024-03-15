import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class EmElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('emphasis', name, attributes, context);
    }
}
