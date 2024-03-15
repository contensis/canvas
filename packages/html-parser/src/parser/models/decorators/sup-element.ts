import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class SupElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('superscript', name, attributes, context);
    }
}
