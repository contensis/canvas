import { Block, DecoratorType, FragmentBlock, InlineChildren, isInline, isMergeableFragment, LiquidBlock } from '../../../models';
import { BaseElement } from '../base-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toText, toValue } from '../shared';
import { PreElement } from './pre-element';

export class CodeElement extends BaseElement {
    private canAdd: () => boolean;
    private createBlock: () => Block;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        const language = this.attributes['data-language'];
        const type = language === 'liquid' && this.context.canAddType('_liquid') ? 'liquid' : 'code';
        this.popContext = type === 'liquid' ? context.setType('_liquid', this) : context.setDecorator('code');
        this.canAdd = type === 'liquid' ? () => context.canAddType('_liquid') : () => context.canAddDecorator('code');
        this.createBlock = type === 'liquid' ? () => this.createLiquid() : () => this.createCodeFragment();
    }

    appendTo(parent: Element) {
        this.popContext();
        if (parent instanceof PreElement) {
            const code = toText(this.children, false);
            parent.setCode(code, this.attributes);
        } else if (this.canAdd()) {
            parent.append(this.createBlock());
        } else {
            const children = this.mergeItems(this.children);
            parent.append(...children);
        }
    }

    append(...items: Block[]) {
        const children = this.mergeItems(items);
        this.children.push(...children);
    }

    private createLiquid(): LiquidBlock {
        const code = toText(this.children, true);
        return {
            type: '_liquid',
            id: this.id(),
            properties: {
                type: this.attributes['data-liquid-type'] === 'tag' ? 'tag' : 'variable'
            },
            value: code
        };
    }

    // this is copied from DecoratorElement
    private createCodeFragment(): FragmentBlock {
        const children = this.mergeItems(this.children).filter(isInline);
        const decorators: DecoratorType[] = ['code'];
        let value: InlineChildren;
        if (children.length === 1 && isMergeableFragment(children[0])) {
            const firstChild = children[0];
            decorators.push(...(firstChild.properties?.decorators || []));
            value = firstChild.value as InlineChildren;
        } else {
            value = toValue(children);
        }
        return {
            type: '_fragment',
            id: this.id(),
            properties: this.withFriendlyId({ decorators }),
            value
        };
    }
}
