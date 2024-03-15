import { LinkType, getLinkType } from '../links';
import { Attributes, Resolver } from '../models';
import { ResolveContext } from '../resolve-context';

export class AResolver implements Resolver {
    private linkType: LinkType;

    constructor(_name: string, private attributes: Attributes, private context: ResolveContext) {
        this.linkType = getLinkType(attributes);
    }

    resolve() {
        switch (this.linkType) {
            case '_link': {
                this.resolveLink();
                break;
            }
            case '_inlineEntry': {
                this.resolveInlineEntry();
                break;
            }
            default: {
                break;
            }
        }
    }

    resolveInlineEntry() {
        // do nothing
    }

    resolveLink() {
        const url = this.attributes['href'] || '';
        if (!url.startsWith('#')) {
            this.context.resolve('node', url);
            this.context.resolve('entry', url);
        }
    }
}
