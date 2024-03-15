import { BaseElement } from './base-element';
import { wrapInline } from './shared';

export class RootElement extends BaseElement {
    export() {
        this.children = this.mergeItems(this.children);
        this.children = wrapInline(this.children, () => ({
            type: '_paragraph' as const,
            id: this.id(),
            value: []
        }));
        this.children = this.trimItems(this.children);
        return this.children;
    }
}
