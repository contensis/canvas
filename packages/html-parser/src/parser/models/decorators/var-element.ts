import { Context } from '../context';
import { Attributes } from '../models';
import { DecoratorElement } from './decorator-element';

export class VarElement extends DecoratorElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super('variable', name, attributes, context);
    }
}
