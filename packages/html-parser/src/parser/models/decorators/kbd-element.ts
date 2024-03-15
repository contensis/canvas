import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class KbdElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('keyboard', name, attributes, context);
    }
}
