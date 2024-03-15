import { ComponentBlock } from '../../../models';
import { Attributes, Element } from '../models';
import { Context, tryParse } from '../context';
import { BlockElement } from '../block-element';

export class DivElement extends BlockElement {
    private _isComponent: boolean;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this._isComponent = this.isComponent();
        if (this._isComponent) {
            this.popContext = context.setType('_component', this);
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

    private getComponentProperties(): { component: string; value: any } {
        const component = this.attributes['data-component'];
        let isValid = component && this.context.hasSetting(['type.component.component', component]);
        if (isValid) {
            const { components } = this.context.parserSettings;
            isValid = components.includes(component);
        }
        const value = isValid ? tryParse(this.attributes['data-component-value']) : null;
        return { component, value };
    }
}
