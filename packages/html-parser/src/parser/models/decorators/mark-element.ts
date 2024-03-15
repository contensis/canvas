import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class MarkElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('mark', name, attributes, context);
    }
}
