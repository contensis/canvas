import { Element } from './models';
import { BaseElement } from './base-element';
import { wrapInline } from './shared';

export class BlockElement extends BaseElement {
    appendTo(parent: Element) {
        let children = this.mergeItems(this.children);
        if (this.context.canAddType('_paragraph')) {
            children = wrapInline(children, () => ({
                type: '_paragraph' as const,
                id: this.id(),
                value: []
            }));
            children = this.trimItems(children);
        }
        parent.append(...children);
    }
}
