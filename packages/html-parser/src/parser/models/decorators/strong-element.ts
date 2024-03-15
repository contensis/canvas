import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class StrongElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('strong', name, attributes, context);
    }
}
