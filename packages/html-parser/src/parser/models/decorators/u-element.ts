import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class UElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('underline', name, attributes, context);
    }
}
