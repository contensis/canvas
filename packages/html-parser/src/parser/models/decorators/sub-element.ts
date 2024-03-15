import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class SubElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('subscript', name, attributes, context);
    }
}
