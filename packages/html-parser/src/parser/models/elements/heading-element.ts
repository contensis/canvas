import { HeadingBlock, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { HEADING_TAGS, toValue } from '../shared';

export class HeadingElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_heading', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_heading')) {
            const children = this.mergeItems(this.children).filter(isInline);
            const value = this.trimItems(children);
            const heading: HeadingBlock = {
                type: '_heading',
                id: this.id(),
                properties: this.withFriendlyId(this.getProperties()),
                value: toValue(value)
            };
            parent.append(heading);
        } else {
            super.appendTo(parent);
        }
    }

    private getProperties(): HeadingBlock['properties'] {
        const { value: level } = this.context.fixSetting('type.heading.level', HEADING_TAGS[this.name], 1);
        return { level };
    }
}
