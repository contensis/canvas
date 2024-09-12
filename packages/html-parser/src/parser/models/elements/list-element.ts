import { ListBlock, isListItem } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { LIST_TAGS } from '../shared';

export class ListElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_list', this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.context.canAddType('_list')) {
            let children = this.mergeItems(this.children);
            children = this.trimItems(children);
            const value = children.filter(isListItem);
            const properties = this.getProperties();

            const list: ListBlock = {
                type: '_list',
                id: this.id(),
                properties: this.withFriendlyId(properties),
                value
            };
            parent.append(list);
        } else {
            super.appendTo(parent);
        }
    }

    private getProperties(): ListBlock['properties'] {
        const { value: listType } = this.context.fixSetting('type.list.listType', LIST_TAGS[this.name as 'ol'], 'unordered');
        const properties: ListBlock['properties'] = {
            listType: listType || 'unordered'
        };
        if (listType === 'ordered') {
            const startAttr = this.attributes.start;
            if (startAttr) {
                const start = parseInt(startAttr);
                if (!isNaN(start)) {
                    properties.start = start;
                }
            }
        }
        return properties;
    }
}
