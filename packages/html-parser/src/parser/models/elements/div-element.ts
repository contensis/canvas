import { Asset, AssetBlock, ComponentBlock, Entry, EntryBlock, FormContentTypeBlock } from '../../../models';
import { Attributes, Element } from '../models';
import { Context, tryParse } from '../context';
import { BlockElement } from '../block-element';

type DivType = 'none' | 'component' | 'form' | 'asset' | 'entry';

export class DivElement extends BlockElement {
    private type: DivType;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.type = this.getDivType();
        switch (this.type) {
            case 'asset': {
                this.popContext = context.setType('_asset', this);
                break;
            }
            case 'component': {
                this.popContext = context.setType('_component', this);
                break;
            }
            case 'entry': {
                this.popContext = context.setType('_entry', this);
                break;
            }
            case 'form': {
                this.popContext = context.setType('_formContentType', this);
                break;
            }
            default: {
                break;
            }
        }
    }

    appendTo(parent: Element) {
        this.popContext?.();
        if (this.type === 'asset' && this.context.canAddType('_asset')) {
            const value = this.getAsset();
            const assetItem: AssetBlock = {
                type: '_asset',
                id: this.id(),
                properties: this.withFriendlyId(),
                value: value as Asset
            };
            parent.append(assetItem);
        } else if (this.type === 'component' && this.context.canAddType('_component')) {
            const { component, value } = this.getComponentProperties();
            const componentItem: ComponentBlock = {
                type: '_component',
                id: this.id(),
                properties: this.withFriendlyId({ component }),
                value
            };
            parent.append(componentItem);
        } else if (this.type === 'entry' && this.context.canAddType('_entry')) {
            const value = this.getEntry();
            const entryItem: EntryBlock = {
                type: '_entry',
                id: this.id(),
                properties: this.withFriendlyId(),
                value: value as Entry
            };
            parent.append(entryItem);
        } else if (this.type === 'form' && this.context.canAddType('_formContentType')) {
            const formItem: FormContentTypeBlock = {
                type: '_formContentType',
                id: this.id(),
                properties: this.withFriendlyId({}),
                value: {
                    contentType: {
                        id: this.getFormId() as string
                    }
                }
            };
            parent.append(formItem);
        } else {
            super.appendTo(parent);
        }
    }

    private getDivType(): DivType {
        if (this.getFormId()) {
            return 'form';
        } else if (this.getAsset()) {
            return 'asset';
        } else if (this.getEntry()) {
            return 'entry';
        } else {
            const classList = this.attributes['class']?.split(' ');
            if (classList?.includes('component')) {
                const { component, value } = this.getComponentProperties();
                if (!!component && !!value) {
                    return 'component';
                }
            }
        }
        return 'none';
    }

    private getComponentProperties(): { component: string; value: any } {
        const component = this.attributes['data-component'];
        let isValid = component && this.context.hasSetting(['type.component.component', component]);
        if (isValid) {
            const { components } = this.context.parserSettings;
            isValid = components.includes(component) || components.includes('*');
        }
        const value = isValid ? tryParse(this.attributes['data-component-value']) : null;
        return { component, value };
    }

    private getFormId() {
        const formId = this.attributes['data-contensis-form-id'];
        let isValid = formId && this.context.hasSetting(['type.formContentType.contentType', formId]);
        if (isValid) {
            const { formContentTypes } = this.context.parserSettings;
            isValid = formContentTypes.includes(formId);
        }
        return isValid ? formId : null;
    }

    private getEntry(): null | Entry {
        const entry = tryParse(this.attributes['data-entry']) as Entry;
        if (entry?.sys?.contentTypeId) {
            if (this.context.hasSetting(['type.entry.contentType', entry.sys.contentTypeId])) {
                const { entryContentTypes } = this.context.parserSettings;
                if (entryContentTypes.includes(entry.sys.contentTypeId) || entryContentTypes.includes('*')) {
                    return entry;
                }
            }
        }
        return null;
    }

    private getAsset(): null | Asset {
        const asset = tryParse(this.attributes['data-asset']) as Asset;
        if (asset?.sys?.contentTypeId) {
            if (this.context.hasSetting(['type.asset.contentType', asset.sys.contentTypeId])) {
                const { assetContentTypes } = this.context.parserSettings;
                if (assetContentTypes.includes(asset.sys.contentTypeId) || assetContentTypes.includes('*')) {
                    return asset;
                }
            }
        }
        return null;
    }
}
