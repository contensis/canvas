import { BaseElement } from './base-element';
import { Element } from './models';

export abstract class VoidElement extends BaseElement {
    abstract appendTo(parent: Element): void;

    append() {
        // do nothing
    }

    addText() {
        // do nothing
    }
}
