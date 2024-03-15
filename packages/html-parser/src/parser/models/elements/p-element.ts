import { ParagraphBlock, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Element } from '../models';
import { toValue } from '../shared';

export class PElement extends BlockElement {
    appendTo(parent: Element) {
        const classList = this.attributes['class']?.split(' ');
        let paragraphType = classList?.includes('lead') || classList?.includes('lede') ? ('lead' as const) : null;
        if (paragraphType) {
            const { value } = this.context.fixSetting('type.paragraph.paragraphType', paragraphType, null);
            paragraphType = value;
        }
        if (paragraphType) {
            const children = this.mergeItems(this.children).filter(isInline);
            const value = this.trimItems(children);
            const paragraph: ParagraphBlock = {
                type: '_paragraph',
                id: this.id(),
                properties: this.withFriendlyId({ paragraphType }),
                value: toValue(value)
            };
            parent.append(paragraph);
        } else {
            super.appendTo(parent);
        }
    }
}
