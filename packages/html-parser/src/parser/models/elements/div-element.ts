import { ComponentBlock, FormContentTypeBlock } from '../../../models';
import { Attributes, Element } from '../models';
import { Context, tryParse } from '../context';
import { BlockElement } from '../block-element';

export class DivElement extends BlockElement {
    private _isComponent: boolean;
    private _isForm: boolean;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this._isComponent = this.isComponent();
        this._isForm = this.isForm();
        if (this._isComponent) {
            this.popContext = context.setType('_component', this);
        } else if (this._isForm) {
            this.popContext = context.setType('_formContentType', this);
        }
    }

    appendTo(parent: Element) {
        this.popContext?.();
        if (this._isComponent && this.context.canAddType('_component')) {
            const { component, value } = this.getComponentProperties();
            const componentItem: ComponentBlock = {
                type: '_component',
                id: this.id(),
                properties: this.withFriendlyId({ component }),
                value
            };
            parent.append(componentItem);
        } else if (this._isForm && this.context.canAddType('_formContentType')) {
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

    private isComponent() {
        const classList = this.attributes['class']?.split(' ');
        if (!classList?.includes('component')) {
            return false;
        }
        const { component, value } = this.getComponentProperties();
        return !!component && !!value;
    }

    private isForm() {
        return !!this.getFormId();
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
}
