import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class DelElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('delete', name, attributes, context);
    }
}
