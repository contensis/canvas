import { Block, FragmentBlock, InlineBlock, DecoratorType, InlineChildren, isMergeableFragment, isInline } from '../../../models';
import { BaseElement } from '../base-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';

export abstract class DecoratorElement extends BaseElement {
    constructor(
        protected type: DecoratorType,
        name: string,
        attributes: Attributes,
        context: Context
    ) {
        super(name, attributes, context);
        this.popContext = context.setDecorator(type);
    }

    appendTo(parent: Element) {
        const children = this.mergeItems(this.children);
        this.popContext();
        if (this.context.canAddDecorator(this.type)) {
            parent.append(this.createFragment(children.filter(isInline)));
        } else {
            parent.append(...children);
        }
    }

    append(...items: Block[]) {
        const children = this.mergeItems(items);
        this.children.push(...children);
    }

    getProperties(): Partial<FragmentBlock['properties']> {
        return {};
    }

    private createFragment(children: InlineBlock[]): FragmentBlock {
        const decorators: DecoratorType[] = [this.type];
        let value: InlineChildren | undefined;
        if (children.length === 1 && isMergeableFragment(children[0])) {
            const firstChild = children[0];
            decorators.push(...(firstChild.properties?.decorators || []));
            value = firstChild.value;
        } else {
            value = toValue(children);
        }
        const properties = this.getProperties();
        return {
            type: '_fragment',
            id: this.id(),
            properties: this.withFriendlyId({ ...properties, decorators }),
            value
        };
    }
}
