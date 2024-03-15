import { Block, isSimpleFragment } from '../../models';
import { Context } from './context';
import { Attributes, Element, VoidFn } from './models';
import { mergeItems, trimItems } from './shared';

export class BaseElement implements Element {
    protected children: Block[] = [];
    protected popContext!: VoidFn;

    constructor(protected name: string, protected attributes: Attributes, protected context: Context) {}

    appendTo(parent: Element) {
        const children = this.mergeItems(this.children);
        parent.append(...children);
    }

    append(...items: Block[]) {
        this.children.push(...items);
    }

    addText(text: string) {
        const lastChild = this.children[this.children.length];
        if (isSimpleFragment(lastChild)) {
            lastChild.value += text;
        } else {
            this.children.push({
                type: '_fragment',
                id: this.newId(),
                value: text
            });
        }
    }

    export() {
        return this.children;
    }

    id() {
        return this.context.id(this.attributes);
    }

    newId() {
        return this.context.id({});
    }

    withFriendlyId<T extends object>(properties?: T)  {
        if (!properties) return properties;
        return this.context.withFriendlyId(properties, this.attributes);
    }

    findFriendlyId(id: string) {
        return this.context.findFriendlyId(id);
    }

    mergeItems<T extends Block>(blocks: T[]): T[] {
        return mergeItems(blocks, () => this.newId());
    }

    trimItems<T extends Block>(blocks: T[], removeEmptyBlocks = true): T[] {
        return trimItems(blocks, removeEmptyBlocks, () => this.newId());
    }
}
