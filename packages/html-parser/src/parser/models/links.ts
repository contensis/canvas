import { CanvasSettings } from '../../models';
import { LinkClassnames } from '../../utils';
import { Attributes } from './models';

export type LinkType = '_anchor' | '_link' | '_inlineEntry';

export type LinkDataType = CanvasSettings['type.link.linkType'][0];

export function getLinkType(attributes: Attributes): LinkType {
    if (attributes['class']) {
        const classList = attributes['class'].split(' ');
        if (classList.includes(LinkClassnames.inlineEntry)) {
            return '_inlineEntry';
        }
        if (classList.includes(LinkClassnames.anchor)) {
            return '_anchor';
        }
        if (classList.includes(LinkClassnames.link)) {
            return '_link';
        }
    }
    if (!attributes.href && (attributes.id || attributes.name)) {
        return '_anchor';
    }
    return '_link';
}
