import {
    ComposedItem, ComposedItemTypeMap, AnchorComposedItem, CodeComposedItem, ComponentComposedItem, DividerComposedItem, FragmentComposedItem,
    HeadingComposedItem, ImageComposedItem, InlineEntryComposedItem, ListComposedItem, ListItemComposedItem, ParagraphComposedItem,
    TableComposedItem, TableHeaderComposedItem, TableBodyComposedItem, TableFooterComposedItem, TableRowComposedItem, TableHeaderCellComposedItem,
    TableCellComposedItem, TableCaptionComposedItem, PanelComposedItem, DecoratorType, DecoratorTypeMap, LinkComposedItem, ComposedItemType
} from '@contensis-canvas/types';

type Props = Record<string, any>;
type Child<T> = string | number | boolean | T;

type H<T, TFragment> = (type: string | TFragment, props: Props, ...children: Child<T>[]) => T;

type Attributes = Record<string, any>;
type WriteContext = Record<string, any>;
type WithContext = { context: WriteContext };

export type WriterProps = { data: ComposedItem[], context?: WriteContext };
type WriteComposedItemsProps = { items: ComposedItem[] } & WithContext;
type WriteComposedItemProps<T extends ComposedItem> = { item: T } & WithContext & Attributes;
type WriteTextProps = { text: string } & WithContext;

type ComposedItemWriter<T extends ComposedItem, TNode> = (props: WriteComposedItemProps<T>, ...children: Child<TNode>[]) => TNode;
type ComposedItemWriters<TNode> = ComposedItemTypeMap<ComposedItemWriter<ComposedItem, TNode>>;

type WriteDecoratorProps = { item: FragmentComposedItem, decorator: DecoratorType, otherDecorators: DecoratorType[] } & WithContext & Attributes;

type DecoratorWriter<TNode> = (props: WriteDecoratorProps, ...children: Child<TNode>[]) => TNode;
type DecoratorWriters<TNode> = DecoratorTypeMap<DecoratorWriter<TNode>>;

type DecoratorProps = { item: FragmentComposedItem, decorators: DecoratorType[] } & WithContext;

type ComponentItemWriter<TNode> = (props: WriteComposedItemProps<ComponentComposedItem>, ...children: Child<TNode>[]) => TNode;
type ComponentItemWriters<TNode> = Record<string, ComponentItemWriter<TNode>>;

type AttributeProps = WriteComposedItemProps<ComposedItem> | WriteDecoratorProps;
type WriteFunction<TNode> = (props: WriterProps) => TNode;

export type WriterOverrides<TNode> = {
    items?: Partial<ComposedItemWriters<TNode>>,
    decorators?: Partial<DecoratorWriters<TNode>>,
    components?: Partial<ComponentItemWriters<TNode>>
};

class DomWriter<TNode, TFragment> {

    private itemWriters: ComposedItemWriters<TNode>;
    private decoratorWriters: DecoratorWriters<TNode>;
    private defaultItemWriters: ComposedItemWriters<TNode>;
    private defaultDecoratorWriters: DecoratorWriters<TNode>;
    private componentItemWriters: Partial<ComponentItemWriters<TNode>>;

    constructor(
        private h: H<TNode, TFragment>,
        private hFragment: TFragment
    ) {
        this.defaultItemWriters = {
            '_anchor': this._anchor.bind(this),
            '_code': this._codeWithCaption.bind(this),
            '_component': this._component.bind(this),
            '_divider': this._divider.bind(this),
            '_fragment': this._fragment.bind(this),
            '_heading': this._heading.bind(this),
            '_image': this._imageWithCaption.bind(this),
            '_inlineEntry': this._inlineEntry.bind(this),
            '_link': this._link.bind(this),
            '_list': this._list.bind(this),
            '_listItem': this._listItem.bind(this),
            '_panel': this._panel.bind(this),
            '_paragraph': this._paragraph.bind(this),
            '_table': this._table.bind(this),
            '_tableBody': this._tableBody.bind(this),
            '_tableCaption': this._tableCaption.bind(this),
            '_tableCell': this._tableCell.bind(this),
            '_tableFooter': this._tableFooter.bind(this),
            '_tableHeader': this._tableHeader.bind(this),
            '_tableHeaderCell': this._tableHeaderCell.bind(this),
            '_tableRow': this._tableRow.bind(this)
        };

        this.defaultDecoratorWriters = {
            code: this.code.bind(this),
            delete: this.delete.bind(this),
            emphasis: this.emphasis.bind(this),
            insert: this.insert.bind(this),
            keyboard: this.keyboard.bind(this),
            linebreak: this.linebreak.bind(this),
            mark: this.mark.bind(this),
            strong: this.strong.bind(this),
            strikethrough: this.strikethrough.bind(this),
            subscript: this.subscript.bind(this),
            superscript: this.superscript.bind(this),
            underline: this.underline.bind(this),
            variable: this.variable.bind(this)
        };

        this.itemWriters = { ...this.defaultItemWriters };
        this.decoratorWriters = { ...this.defaultDecoratorWriters };
        this.componentItemWriters = {};
    }

    setOverrides(overrides?: WriterOverrides<TNode>) {
        const overrideItems = overrides?.items;
        this.itemWriters = Object.keys(this.defaultItemWriters)
            .reduce((prev, type) => {
                const itemType = type as ComposedItemType;
                prev[itemType] = overrideItems?.[itemType] || this.defaultItemWriters[itemType];
                return prev;
            }, {} as ComposedItemWriters<TNode>);

        const overrideDecorators = overrides?.decorators;
        this.decoratorWriters = Object.keys(this.defaultDecoratorWriters)
            .reduce((prev, type) => {
                const decoratorType = type as DecoratorType;
                prev[decoratorType] = overrideDecorators?.[decoratorType] || this.defaultDecoratorWriters[decoratorType];
                return prev;
            }, {} as DecoratorWriters<TNode>);

        this.componentItemWriters = overrides?.components || {};
    }

    _anchor(props: WriteComposedItemProps<AnchorComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'a',
            attributes,
            ...(this.getChildren(children, () => this._anchorChildren({ item, context })))
        );
    }

    _anchorChildren(props: WriteComposedItemProps<AnchorComposedItem>) {
        return this.writeChildren(props);
    }

    _code(props: WriteComposedItemProps<CodeComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props, {
            'data-language': item?.value?.language
        });
        const codeAttributes = { className: `language-${item?.value?.language}` };
        return this.h(
            'pre',
            attributes,
            this.h(
                'code',
                codeAttributes,
                ...(this.getChildren(children, () => this._codeChildren({ item, context })))
            )
        );
    }

    _codeWithCaption(props: WriteComposedItemProps<CodeComposedItem>) {
        const { item } = props;
        const caption = item?.value?.caption;
        if (caption) {
            return this.withCaption(caption, this._code(props));
        } else {
            return this._code(props);
        }
    }

    _codeChildren = function (props: WriteComposedItemProps<CodeComposedItem>) {
        return this.toFragment([props.item?.value?.code]);
    }

    _component(props: WriteComposedItemProps<ComponentComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const component = item.properties?.component;
        const Component = this.componentItemWriters?.[component];
        if (Component) {
            return Component(props);
        } {
            const value = item.value ? JSON.stringify(item.value) : '';
            const attributes = this.getAttributes(props, {
                className: 'component',
                'data-component': item.properties?.component,
                'data-component-value': value
            });
            return this.h(
                'div',
                attributes,
                ...(this.getChildren(children, () => this._componentChildren({ item, context })))
            );
        }
    }

    _componentChildren(props: WriteComposedItemProps<ComponentComposedItem>) {
        return this.toFragment([`Component: ${props.item?.properties?.component}`]);
    }

    _divider(props: WriteComposedItemProps<DividerComposedItem>) {
        const attributes = this.getAttributes(props);
        return this.h('hr', attributes);
    }

    _dividerChildren(props: WriteComposedItemProps<DividerComposedItem>) {
        return null;
    }

    _fragment(props: WriteComposedItemProps<FragmentComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const hasDecorators = !!item?.properties?.decorators?.length;
        const decorators = item?.properties?.decorators as DecoratorType[];
        return hasDecorators
            ? this.decorators({ item, decorators, context })
            : this.toFragment(this.getChildren(children, () => this._fragmentChildren({ item, context })));
    }

    _fragmentChildren(props: WriteComposedItemProps<FragmentComposedItem>) {
        return this.writeChildren(props);
    }

    _heading(props: WriteComposedItemProps<HeadingComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        const levels: Record<number, string> = {
            1: 'h1',
            2: 'h2',
            3: 'h3',
            4: 'h4',
            5: 'h5',
            6: 'h6',
        };
        const tagName = (item?.properties?.level && levels[item?.properties?.level]) || 'h1';
        return this.h(
            tagName,
            attributes,
            ...(this.getChildren(children, () => this._headingChildren({ item, context })))
        );
    }

    _headingChildren(props: WriteComposedItemProps<HeadingComposedItem>) {
        return this.writeChildren(props);
    }

    _image(props: WriteComposedItemProps<ImageComposedItem>) {
        const { item } = props;
        const src = item?.value?.asset?.sys?.uri || item?.value?.url; // todo: should this be resolved in delivery???
        // ie. so you will always be able to do 
        // const src = item?.value?.url;
        const attributes = this.getAttributes(props, {
            src,
            alt: item?.value?.altText,
            title: item?.value?.caption,
        });
        return this.h('img', attributes);
    }

    _imageWithCaption(props: WriteComposedItemProps<ImageComposedItem>) {
        const { item } = props;
        const caption = item?.value?.caption;
        if (caption) {
            return this.withCaption(caption, this._image(props));
        } else {
            return this._image(props);
        }
    }

    _imageChildren(props: WriteComposedItemProps<ImageComposedItem>) {
        return null;
    }

    _inlineEntry(props: WriteComposedItemProps<InlineEntryComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const href = item?.value?.sys?.uri;
        const attributes = this.getAttributes(props, { href });
        children = this.getChildren(children, () => this._inlineEntryChildren({ item, context }));
        return !!href
            ? this.h('a', attributes, ...children)
            : this.toFragment(children);
    }

    _inlineEntryChildren(props: WriteComposedItemProps<InlineEntryComposedItem>) {
        const entryTitle = props?.item?.value?.entryTitle || '';
        return this.toFragment([entryTitle]);
    }

    _link(props: WriteComposedItemProps<LinkComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const value = props?.item?.properties;
        const href = value?.node?.path
            || value?.entry?.sys?.uri
            || value?.url
            || (value?.anchor ? `#${value.anchor}` : null);

        // todo: should this be resolved in delivery???
        // ie. so you will always be able to do 
        // const href = item?.value?.url;

        const attributes = this.getAttributes(props, {
            href,
            target: props?.item?.properties?.newTab ? '_blank' : null
        });
        children = this.getChildren(children, () => this._linkChildren({ item, context }));
        return !!href
            ? this.h('a', attributes, ...children)
            : this.toFragment(children)
    }

    _linkChildren(props: WriteComposedItemProps<LinkComposedItem>) {
        return this.writeChildren(props);
    }

    _list(props: WriteComposedItemProps<ListComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const isOrdered = (item?.properties?.listType === 'ordered');
        const attributes = this.getAttributes(props, {
            start: isOrdered ? item?.properties?.start : null,
        });
        return this.h(
            isOrdered ? 'ol' : 'ul',
            attributes,
            ...(this.getChildren(children, () => this._listChildren({ item, context })))
        );
    }

    _listChildren(props: WriteComposedItemProps<ListComposedItem>) {
        return this.writeChildren(props);
    }

    _listItem(props: WriteComposedItemProps<ListItemComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'li',
            attributes,
            ...(this.getChildren(children, () => this._listItemChildren({ item, context })))
        );
    }

    _listItemChildren(props: WriteComposedItemProps<ListItemComposedItem>) {
        return this.writeChildren(props);
    }

    _panel(props: WriteComposedItemProps<PanelComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props, {
            className: ['panel', item?.properties?.panelType || 'info'].join(' ')
        });
        return this.h(
            'aside',
            attributes,
            ...(this.getChildren(children, () => this._panelChildren({ item, context })))
        );
    }

    _panelChildren(props: WriteComposedItemProps<PanelComposedItem>) {
        return this.writeChildren(props);
    }

    _paragraph(props: WriteComposedItemProps<ParagraphComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props, {
            className: item?.properties?.paragraphType
        });
        return this.h(
            'p',
            attributes,
            ...(this.getChildren(children, () => this._paragraphChildren({ item, context })))
        );
    }

    _paragraphChildren(props: WriteComposedItemProps<ParagraphComposedItem>) {
        return this.writeChildren(props);
    }

    _table(props: WriteComposedItemProps<TableComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'table',
            attributes,
            ...(this.getChildren(children, () => this._tableChildren({ item, context })))
        );
    }

    _tableChildren(props: WriteComposedItemProps<TableComposedItem>) {
        return this.writeChildren(props);
    }

    _tableBody(props: WriteComposedItemProps<TableBodyComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'tbody',
            attributes,
            ...(this.getChildren(children, () => this._tableBodyChildren({ item, context })))
        );
    }

    _tableBodyChildren(props: WriteComposedItemProps<TableBodyComposedItem>) {
        return this.writeChildren(props);
    }

    _tableCaption(props: WriteComposedItemProps<TableCaptionComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'caption',
            attributes,
            ...(this.getChildren(children, () => this._tableCaptionChildren({ item, context })))
        );
    }

    _tableCaptionChildren(props: WriteComposedItemProps<TableCaptionComposedItem>) {
        return this.writeChildren(props);
    }

    _tableCell(props: WriteComposedItemProps<TableCellComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'td',
            attributes,
            ...(this.getChildren(children, () => this._tableCellChildren({ item, context })))
        );
    }

    _tableCellChildren(props: WriteComposedItemProps<TableCellComposedItem>) {
        return this.writeChildren(props);
    }

    _tableFooter(props: WriteComposedItemProps<TableFooterComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'tfoot',
            attributes,
            ...(this.getChildren(children, () => this._tableFooterChildren({ item, context })))
        );
    }

    _tableFooterChildren(props: WriteComposedItemProps<TableFooterComposedItem>) {
        return this.writeChildren(props);
    }

    _tableHeader(props: WriteComposedItemProps<TableHeaderComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'thead',
            attributes,
            ...(this.getChildren(children, () => this._tableHeaderChildren({ item, context })))
        );
    }

    _tableHeaderChildren(props: WriteComposedItemProps<TableHeaderComposedItem>) {
        return this.writeChildren(props);
    }

    _tableHeaderCell(props: WriteComposedItemProps<TableHeaderCellComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'th',
            attributes,
            ...(this.getChildren(children, () => this._tableHeaderCellChildren({ item, context })))
        );
    }

    _tableHeaderCellChildren(props: WriteComposedItemProps<TableHeaderCellComposedItem>) {
        return this.writeChildren(props);
    }

    _tableRow(props: WriteComposedItemProps<TableRowComposedItem>, ...children: Child<TNode>[]) {
        const { item, context } = props;
        const attributes = this.getAttributes(props);
        return this.h(
            'tr',
            attributes,
            ...(this.getChildren(children, () => this._tableRowChildren({ item, context })))
        );
    }

    _tableRowChildren(props: WriteComposedItemProps<TableRowComposedItem>) {
        return this.writeChildren(props);
    }

    code(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'code',
            attributes,
            ...(this.getChildren(children, () => this.codeChildren({ item, context, decorator, otherDecorators })))
        );
    }

    codeChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    delete(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'del',
            attributes,
            ...(this.getChildren(children, () => this.deleteChildren({ item, context, decorator, otherDecorators })))
        );
    }

    deleteChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    emphasis(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'em',
            attributes,
            ...(this.getChildren(children, () => this.emphasisChildren({ item, context, decorator, otherDecorators })))
        );
    }

    emphasisChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    insert(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'ins',
            attributes,
            ...(this.getChildren(children, () => this.insertChildren({ item, context, decorator, otherDecorators })))
        );
    }

    insertChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    keyboard(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'kbd',
            attributes,
            ...(this.getChildren(children, () => this.keyboardChildren({ item, context, decorator, otherDecorators })))
        );
    }

    keyboardChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    linebreak(props: WriteDecoratorProps) {
        const attributes = this.getAttributes(props);
        return this.h('br', attributes);
    }

    lineBreakChildren(props: WriteDecoratorProps) {
        return null;
    }

    mark(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'mark',
            attributes,
            ...(this.getChildren(children, () => this.markChildren({ item, context, decorator, otherDecorators })))
        );
    }

    markChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    strong(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'strong',
            attributes,
            ...(this.getChildren(children, () => this.strongChildren({ item, context, decorator, otherDecorators })))
        );
    }

    strongChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    strikethrough(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            's',
            attributes,
            ...(this.getChildren(children, () => this.strikethroughChildren({ item, context, decorator, otherDecorators })))
        );
    }

    strikethroughChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    subscript(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'sub',
            attributes,
            ...(this.getChildren(children, () => this.subscriptChildren({ item, context, decorator, otherDecorators })))
        );
    }

    subscriptChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    superscript(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'sup',
            attributes,
            ...(this.getChildren(children, () => this.superscriptChildren({ item, context, decorator, otherDecorators })))
        );
    }

    superscriptChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    underline(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'u',
            attributes,
            ...(this.getChildren(children, () => this.underlineChildren({ item, context, decorator, otherDecorators })))
        );
    }

    underlineChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    variable(props: WriteDecoratorProps, ...children: Child<TNode>[]) {
        const attributes = this.getAttributes(props);
        const { item, context, decorator, otherDecorators } = props;
        return this.h(
            'var',
            attributes,
            ...(this.getChildren(children, () => this.variableChildren({ item, context, decorator, otherDecorators })))
        );
    }

    variableChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    write(props: WriterProps) {
        let { data, context } = props;
        context = newContext(context || {}, true);
        return this.toFragment(this.writeItems({ items: data, context }));
    }

    private toFragment(children: Child<TNode>[]) {
        return this.h(this.hFragment, {}, ...children);
    }

    private writeChildren(props: WriteComposedItemProps<ComposedItem>) {
        const { item, context } = props;
        const isArray = Array.isArray(item?.value);
        const isString = typeof item?.value === 'string';
        if (isArray) {
            return this.toFragment(this.writeItems({ items: item.value as any, context }));
        } else if (isString) {
            return this.writeText({ text: item.value as any, context });
        } else {
            return this.writeText({ text: '', context });
        }
    }

    private writeItems(props: WriteComposedItemsProps) {
        return props.items.map(item => this.writeItem({ item, context: props.context }));
    }

    private writeItem(props: WriteComposedItemProps<ComposedItem>) {
        let { item, context } = props;
        const Component = this.itemWriters[item.type];
        context = newContext(context);
        return Component({ item, context });
    }

    private writeText(props: WriteTextProps) {
        return this.toFragment([props.text]);
    }

    private decorators(props: DecoratorProps): TNode {
        let { item, context } = props;
        const remainingDecorators = !!props.decorators ? [...props.decorators] : null;
        const firstDecorator = !!remainingDecorators ? remainingDecorators.shift() : null;
        const Decorator = !!firstDecorator ? this.decoratorWriters[firstDecorator] : null;

        if (Decorator) {
            context = newContext(context);
            return Decorator({ item, context, decorator: firstDecorator as DecoratorType, otherDecorators: remainingDecorators as DecoratorType[] })
        } else if (firstDecorator) {
            context = newContext(context);
            return this.decorators({ item, context, decorators: remainingDecorators as DecoratorType[] });
        } else {
            return this._fragmentChildren({ item, context });
        }
    }

    private withCaption(caption: string | undefined, ...children: Child<TNode>[]) {
        return this.h(
            'figure',
            {},
            ...children,
            this.h('figcaption', {}, caption)
        );
    }

    private getAttributes(props: AttributeProps, extra: Record<string, any> = {}) {
        const { item, context, ...rest } = props;
        let { decorator, otherDecorators, ...attributes } = rest as Record<string, any>;
        attributes = {
            id: item?.properties?.id,
            ...extra,
            ...attributes
        };
        attributes = Object.keys(attributes)
            .filter(key => isPopulated(attributes[key]))
            .reduce((prev, key) => ({ ...prev, [key]: attributes[key] }), {} as Record<string, any>);
        return attributes;
    }

    private getChildren(
        children: Child<TNode> | Child<TNode>[],
        defaultChildren: () => Child<TNode> | Child<TNode>[]
    ) {
        const isEmptyChildren = !children || (Array.isArray(children) && !children.length);
        children = isEmptyChildren ? defaultChildren() : children;
        return Array.isArray(children) ? children : [children];
    }

}

function isPopulated(value: any) {
    return !((value === null) || (typeof value === 'undefined'));
}

function newContext(parent: WriteContext, isRoot?: boolean) {
    const context: WriteContext = Object.create(parent);
    if (isRoot) {
        context.$root = context;
    } else {
        context.$parent = parent;
    }
    return context;
}

function withChildren<T extends Function, TChildren extends Function, TNode, TFragment>(fn: T, children: TChildren, writer: DomWriter<TNode, TFragment>): T & { Children: TChildren } {
    const result: T & { Children: TChildren } = fn.bind(writer);
    result.Children = children.bind(writer);
    return result;
}

export function createDomWriterFactory<TNode, TFragment>(
    h: H<TNode, TFragment>,
    hFragment: TFragment
) {
    const writer = new DomWriter(h, hFragment);

    const createWriter = (overrides?: WriterOverrides<TNode>): WriteFunction<TNode> => {
        writer.setOverrides(overrides);
        const write = writer.write.bind(writer);
        return write;
    };

    return {
        createWriter,

        Anchor: withChildren(writer._anchor, writer._anchorChildren, writer),
        Code: withChildren(writer._code, writer._codeChildren, writer),
        Component: withChildren(writer._component, writer._componentChildren, writer),
        Divider: withChildren(writer._divider, writer._dividerChildren, writer),
        Fragment: withChildren(writer._fragment, writer._fragmentChildren, writer),
        Image: withChildren(writer._image, writer._imageChildren, writer),
        InlineEntry: withChildren(writer._inlineEntry, writer._inlineEntryChildren, writer),
        Heading: withChildren(writer._heading, writer._headingChildren, writer),
        Link: withChildren(writer._link, writer._linkChildren, writer),
        List: withChildren(writer._list, writer._listChildren, writer),
        ListItem: withChildren(writer._listItem, writer._listItemChildren, writer),
        Panel: withChildren(writer._panel, writer._panelChildren, writer),
        Paragraph: withChildren(writer._paragraph, writer._paragraphChildren, writer),
        Table: withChildren(writer._table, writer._tableChildren, writer),
        TableBody: withChildren(writer._tableBody, writer._tableBodyChildren, writer),
        TableCaption: withChildren(writer._tableCaption, writer._tableCaptionChildren, writer),
        TableCell: withChildren(writer._tableCell, writer._tableCellChildren, writer),
        TableFooter: withChildren(writer._tableFooter, writer._tableFooterChildren, writer),
        TableHeader: withChildren(writer._tableHeader, writer._tableHeaderChildren, writer),
        TableHeaderCell: withChildren(writer._tableHeaderCell, writer._tableHeaderCellChildren, writer),
        TableRow: withChildren(writer._tableRow, writer._tableRowChildren, writer),

        InlineCode: withChildren(writer.code, writer.codeChildren, writer),
        Delete: withChildren(writer.delete, writer.deleteChildren, writer),
        Emphasis: withChildren(writer.emphasis, writer.emphasisChildren, writer),
        Insert: withChildren(writer.insert, writer.insertChildren, writer),
        Keyboard: withChildren(writer.keyboard, writer.keyboardChildren, writer),
        Linebreak: withChildren(writer.linebreak, writer.lineBreakChildren, writer),
        Mark: withChildren(writer.mark, writer.markChildren, writer),
        Strong: withChildren(writer.strong, writer.strongChildren, writer),
        Strikethrough: withChildren(writer.strikethrough, writer.strikethroughChildren, writer),
        Subscript: withChildren(writer.subscript, writer.subscriptChildren, writer),
        Superscript: withChildren(writer.superscript, writer.superscriptChildren, writer),
        Underline: withChildren(writer.underline, writer.underlineChildren, writer),
        Variable: withChildren(writer.variable, writer.variableChildren, writer)
    };
};