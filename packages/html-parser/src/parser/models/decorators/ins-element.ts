import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class InsElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('insert', name, attributes, context);
    }
}
