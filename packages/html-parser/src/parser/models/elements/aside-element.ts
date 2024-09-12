import { PanelBlock, PanelType, PanelTypes, isInline } from '../../../models';
import { BlockElement } from '../block-element';
import { Context } from '../context';
import { Attributes, Element } from '../models';
import { toValue } from '../shared';

export class AsideElement extends BlockElement {
    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_panel', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_panel')) {
            const children = this.mergeItems(this.children).filter(isInline);
            const value = this.trimItems(children);
            const panel: PanelBlock = {
                type: '_panel',
                id: this.id(),
                properties: this.withFriendlyId(this.getProperties()),
                value: toValue(value)
            };
            parent.append(panel);
        } else {
            super.appendTo(parent);
        }
    }

    private getProperties(): PanelBlock['properties'] {
        let _panelType: undefined | PanelType;
        if (this.attributes['class']) {
            const classList = this.attributes['class'].split(' ');
            _panelType = PanelTypes.find((panelType) => classList.includes(panelType));
        }
        const { value: panelType } = this.context.fixSetting('type.panel.panelType', _panelType || 'info', 'info');
        return !!panelType ? { panelType } : {};
    }
}
