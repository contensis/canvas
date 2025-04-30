import { AnchorBlock, Entry, InlineEntryBlock, LinkBlock, isInline } from '../../../models';
import { BaseElement } from '../base-element';
import { Context, tryParse } from '../context';
import { LinkType, getLinkType } from '../links';
import { Attributes, Element } from '../models';
import { toValue, wrapInline } from '../shared';

type Link = Exclude<LinkBlock['properties'], undefined>['link'];

export class AElement extends BaseElement {
    private linkType: LinkType;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.linkType = getLinkType(attributes);
        this.popContext = context.setType(this.linkType, this);
    }

    appendTo(parent: Element) {
        this.popContext();

        if (this.context.canAddType(this.linkType)) {
            switch (this.linkType) {
                case '_anchor': {
                    this.addAnchor(parent);
                    break;
                }
                case '_inlineEntry': {
                    this.addInlineEntry(parent);
                    break;
                }
                default: {
                    this.addLink(parent);
                    break;
                }
            }
        } else {
            const children = this.mergeItems(this.children);
            parent.append(...children);
        }
    }

    private addAnchor(parent: Element) {
        const children = this.mergeItems(this.children).filter(isInline);
        const value = this.trimItems(children);
        const id = this.attributes['data-id'] || this.attributes.id || this.attributes.name;
        const anchor: AnchorBlock = {
            type: '_anchor',
            id: this.id(),
            properties: this.withFriendlyId({ id }),
            value: toValue(value)
        };
        parent.append(anchor);
    }

    private addInlineEntry(parent: Element) {
        const value = tryParse<Entry>(this.attributes['data-entry']);
        if (value) {
            const inlineEntry: InlineEntryBlock = {
                type: '_inlineEntry',
                id: this.id(),
                properties: this.withFriendlyId(),
                value
            };
            parent.append(inlineEntry);
        }
    }

    private addLink(parent: Element) {
        const link = this.getLink();
        const hasData = link?.sys?.uri || link?.sys?.id || link?.sys?.node?.id;
        if (hasData && this.context.hasSetting(['type.link.linkType', (link as any).sys.linkProperties.type])) {
            const newTab = this.attributes['target'] === '_blank' ? true : undefined;
            const variant = this.attributes['data-link-variant'];
            let children = this.mergeItems(this.children);
            children = this.trimItems(children);
            children = wrapInline(children, (index) => {
                const properties = !index ? this.withFriendlyId({ link, newTab, variant }) : { link, newTab, variant };
                return {
                    type: '_link',
                    id: this.id(),
                    properties,
                    value: []
                };
            });
            parent.append(...children);
        } else {
            const children = this.mergeItems(this.children);
            parent.append(...children);
        }
    }

    private getLink(): null | Link {
        const link = tryParse<Link>(this.attributes['data-link']);
        if (link) {
            return link;
        }
        const href = this.attributes['href'] || '';
        if (!href) {
            return null;
        }

        if (href.startsWith('#')) {
            // anchor
            return {
                sys: {
                    linkProperties: {
                        type: 'uri'
                    },
                    uri: href
                }
            };
        }

        const { path, query, fragment, type } = this.context.getUrl(href);

        if (type === 'mailto' || type === 'tel') {
            return {
                sys: {
                    linkProperties: {
                        type: 'uri'
                    },
                    uri: href
                }
            };
        }

        const node = this.context.getNode(path);
        if (node) {
            // node
            return {
                sys: {
                    linkProperties: {
                        query,
                        fragment,
                        type: 'node'
                    },
                    node,
                    uri: node.path
                }
            };
        }

        const entry = this.context.getEntry(path);
        if (entry) {
            // entry
            return {
                ...entry,
                sys: {
                    ...entry.sys,
                    linkProperties: {
                        query,
                        fragment,
                        type: 'entry'
                    }
                }
            };
        }

        // uri
        const uri = this.context.getAbsoluteUrl(href);
        if (uri) {
            return {
                sys: {
                    linkProperties: {
                        type: 'uri'
                    },
                    uri
                }
            };
        }

        return null;
    }
}
