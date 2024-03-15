import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class SElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('strikethrough', name, attributes, context);
    }
}
