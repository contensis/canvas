import { Block, ListItemBlock, isList } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';

export class LiElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_listItem', this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.context.canAddType('_listItem')) {
            let children = this.mergeItems(this.children);
            children = this.trimItems(children);
            const value = this.getValue(children);
            const listItem: ListItemBlock = {
                type: '_listItem',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(listItem);
        } else {
            super.appendTo(parent);
        }
    }

    private getValue(children: Block[]) {
        const firstListIndex = children.findIndex(isList);
        if (firstListIndex >= 0) {
            children = children.filter((n, i) => i < firstListIndex || isList(n));
        }
        return toValue(children);
    }
}
