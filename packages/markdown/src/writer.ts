import {
    ComposedItem, ComposedItemTypeMap, AnchorComposedItem, CodeComposedItem, ComponentComposedItem, DividerComposedItem, FragmentComposedItem,
    HeadingComposedItem, ImageComposedItem, InlineEntryComposedItem, ListComposedItem, ListItemComposedItem, ParagraphComposedItem,
    TableComposedItem, TableHeaderComposedItem, TableBodyComposedItem, TableFooterComposedItem, TableRowComposedItem, TableHeaderCellComposedItem,
    TableCellComposedItem, TableCaptionComposedItem, PanelComposedItem, DecoratorType, DecoratorTypeMap, LinkComposedItem, ComposedItemType
} from '@contensis/canvas-types';

type Attributes = Record<string, any>;
type WriteContext = Record<string, any>;
type WithContext = { context: WriteContext };

export type WriterProps = { data: ComposedItem[], context?: WriteContext };
type WriteComposedItemsProps = { items: ComposedItem[] } & WithContext;
type WriteComposedItemProps<T extends ComposedItem> = { item: T } & WithContext & Attributes;
type WriteTextProps = { text: string } & WithContext;

type ComposedItemWriter<T extends ComposedItem> = (props: WriteComposedItemProps<T>, ...children: string[]) => string;
type ComposedItemWriters = ComposedItemTypeMap<ComposedItemWriter<ComposedItem>>;

type WriteDecoratorProps = { item: FragmentComposedItem, decorator: DecoratorType, otherDecorators: DecoratorType[] } & WithContext & Attributes;

type DecoratorWriter = (props: WriteDecoratorProps, ...children: string[]) => string;
type DecoratorWriters = DecoratorTypeMap<DecoratorWriter>;

type DecoratorProps = { item: FragmentComposedItem, decorators: DecoratorType[] } & WithContext;

type ComponentItemWriter = (props: WriteComposedItemProps<ComponentComposedItem>, ...children: string[]) => string;
type ComponentItemWriters = Record<string, ComponentItemWriter>;

type WriteFunction = (props: WriterProps) => string;

export type WriterOverrides = {
    items?: Partial<ComposedItemWriters>,
    decorators?: Partial<DecoratorWriters>,
    components?: Partial<ComponentItemWriters>
};

class MarkdownWriter {

    private itemWriters: ComposedItemWriters;
    private decoratorWriters: DecoratorWriters;
    private defaultItemWriters: ComposedItemWriters;
    private defaultDecoratorWriters: DecoratorWriters;
    private componentItemWriters: Partial<ComponentItemWriters>;

    constructor() {
        this.defaultItemWriters = {
            '_anchor': this._anchor.bind(this),
            '_code': this._code.bind(this),
            '_component': this._component.bind(this),
            '_divider': this._divider.bind(this),
            '_fragment': this._fragment.bind(this),
            '_heading': this._heading.bind(this),
            '_image': this._image.bind(this),
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

    setOverrides(overrides?: WriterOverrides) {
        const overrideItems = overrides?.items;
        this.itemWriters = Object.keys(this.defaultItemWriters)
            .reduce((prev, type) => {
                const itemType = type as ComposedItemType;
                prev[itemType] = overrideItems?.[itemType] || this.defaultItemWriters[itemType];
                return prev;
            }, {} as ComposedItemWriters);

        const overrideDecorators = overrides?.decorators;
        this.decoratorWriters = Object.keys(this.defaultDecoratorWriters)
            .reduce((prev, type) => {
                const decoratorType = type as DecoratorType;
                prev[decoratorType] = overrideDecorators?.[decoratorType] || this.defaultDecoratorWriters[decoratorType];
                return prev;
            }, {} as DecoratorWriters);

        this.componentItemWriters = overrides?.components || {};
    }

    _anchor(props: WriteComposedItemProps<AnchorComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._anchorChildren({ item, context }));
        return contents;
    }

    _anchorChildren(props: WriteComposedItemProps<AnchorComposedItem>) {
        return this.writeChildren(props);
    }

    _code(props: WriteComposedItemProps<CodeComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._codeChildren({ item, context }));
        return '```' + item.value?.language + '\n' + contents + '```\n\n';
    }

    _codeChildren(props: WriteComposedItemProps<CodeComposedItem>) {
        return this.encode(props.item?.value?.code);
    }

    _component(props: WriteComposedItemProps<ComponentComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const component = item.properties?.component;
        const Component = this.componentItemWriters?.[component];
        if (Component) {
            return Component(props);
        } else {
            const contents = this.getContents(children, () => this._componentChildren({ item, context }));
            return `${contents}\n\n`;
        }
    }

    _componentChildren(props: WriteComposedItemProps<ComponentComposedItem>) {
        return this.encode(`Component: ${props.item?.properties?.component}`);
    }

    _divider(props: WriteComposedItemProps<DividerComposedItem>) {
        return `---\n\n`;
    }

    _dividerChildren(props: WriteComposedItemProps<DividerComposedItem>) {
        return null;
    }

    _fragment(props: WriteComposedItemProps<FragmentComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const hasDecorators = !!item?.properties?.decorators?.length;
        const decorators = item?.properties?.decorators as DecoratorType[];
        return hasDecorators
            ? this.decorators({ item, decorators, context })
            : this.getContents(children, () => this._fragmentChildren({ item, context }));
    }

    _fragmentChildren(props: WriteComposedItemProps<FragmentComposedItem>) {
        return this.writeChildren(props);
    }

    _heading(props: WriteComposedItemProps<HeadingComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const levels: Record<number, string> = {
            1: '#',
            2: '##',
            3: '###',
            4: '####',
            5: '#####',
            6: '######',
        };
        const level = item?.properties?.level || 1;
        const tagName = levels[level] || '#';
        const contents = this.getContents(children, () => this._headingChildren({ item, context }));
        return `${tagName} ${contents}\n\n`
    }

    _image(props: WriteComposedItemProps<ImageComposedItem>) {
        const { item } = props;
        const src = item?.value?.asset?.sys?.uri || item?.value?.url;
        const altText = this.encode(item?.value?.altText || '');
        const caption = this.encode(item?.value?.caption || '');
        const url = !!caption ? `${src} "${caption}"` : src;
        return `![${altText}](${url})\n\n`
    }

    _imageChildren(props: WriteComposedItemProps<ImageComposedItem>) {
        return null;
    }

    _headingChildren(props: WriteComposedItemProps<HeadingComposedItem>) {
        return this.writeChildren(props);
    }

    _inlineEntry(props: WriteComposedItemProps<InlineEntryComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const href = item?.value?.sys?.uri;
        const contents = this.getContents(children, () => this._inlineEntryChildren({ item, context }));
        return !!href
            ? `[${contents}](${href})`
            : contents;
    }

    _inlineEntryChildren(props: WriteComposedItemProps<InlineEntryComposedItem>) {
        const entryTitle = props?.item?.value?.entryTitle || '';
        return this.encode(entryTitle);
    }

    _link(props: WriteComposedItemProps<LinkComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const value = props?.item?.properties;
        const href = value?.node?.path
            || value?.entry?.sys?.uri
            || value?.url
            || (value?.anchor ? `#${value.anchor}` : null);

        const contents = this.getContents(children, () => this._linkChildren({ item, context }));
        return !!href
            ? `[${contents}](${href})`
            : contents;
    }

    _linkChildren(props: WriteComposedItemProps<LinkComposedItem>) {
        return this.writeChildren(props);
    }

    _list(props: WriteComposedItemProps<ListComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const parentList = !!context.list;
        context.list = item;
        context.indent = !!parentList ? context.indent + '\t' : '';

        const listItems = this.getChildren(children, () => this._listChildren({ item, context }));
        return parentList
            ? `\n${listItems.join('\n')}`
            : `${listItems.join('\n')}\n\n`;
    }

    _listChildren(props: WriteComposedItemProps<ListComposedItem>) {
        const { item, context } = props;
        const isOrdered = (item?.properties?.listType === 'ordered');
        const start = item?.properties?.start || 1;

        let items = this.writeItems({ items: item.value, context });
        items = items
            .map((listItem, index) => isOrdered ? `${start + index}. ${listItem}` : `* ${listItem}`)
            .map(listItem => `${context.indent}${listItem}`);

        return items.join('\n');
    }

    _listItem(props: WriteComposedItemProps<ListItemComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._listItemChildren({ item, context }));
        return `${contents}`;
    }

    _listItemChildren(props: WriteComposedItemProps<ListItemComposedItem>) {
        return this.writeChildren(props);
    }

    _panel(props: WriteComposedItemProps<PanelComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._panelChildren({ item, context }));
        return `${contents}\n\n`;
    }

    _panelChildren(props: WriteComposedItemProps<PanelComposedItem>) {
        return this.writeChildren(props);
    }

    _paragraph(props: WriteComposedItemProps<ParagraphComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._paragraphChildren({ item, context }));
        return `${contents}\n\n`;
    }

    _paragraphChildren(props: WriteComposedItemProps<ParagraphComposedItem>) {
        return this.writeChildren(props);
    }

    _table(props: WriteComposedItemProps<TableComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._tableChildren({ item, context }));
        return `${contents}\n\n`;
    }

    _tableChildren(props: WriteComposedItemProps<TableComposedItem>) {
        return this.writeChildren(props);
    }

    _tableBody(props: WriteComposedItemProps<TableBodyComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const rows = this.getChildren(children, () => this._tableBodyChildren({ item, context }));
        return rows.join('\n');
    }

    _tableBodyChildren(props: WriteComposedItemProps<TableBodyComposedItem>) {
        return this.writeChildren(props);
    }

    _tableCaption(props: WriteComposedItemProps<TableCaptionComposedItem>, ...children: string[]) {
        return '';
    }

    _tableCaptionChildren(props: WriteComposedItemProps<TableCaptionComposedItem>) {
        return this.writeChildren(props);
    }

    _tableCell(props: WriteComposedItemProps<TableCellComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._tableCellChildren({ item, context }));
        return contents;
    }

    _tableCellChildren(props: WriteComposedItemProps<TableCellComposedItem>) {
        return this.writeChildren(props);
    }

    _tableFooter(props: WriteComposedItemProps<TableFooterComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const rows = this.getChildren(children, () => this._tableFooterChildren({ item, context }));
        return rows.join('\n');
    }

    _tableFooterChildren(props: WriteComposedItemProps<TableFooterComposedItem>) {
        return this.writeChildren(props);
    }

    _tableHeader(props: WriteComposedItemProps<TableHeaderComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const rows = this.getChildren(children, () => this._tableHeaderChildren({ item, context }));
        const firstRow = (rows?.[0] || '').trim();
        const underline = firstRow.split('|')
            .map(s => !!s.length ? Array(s.length - 1).join('-') : '')
            .join(' | ')
            .trim();
        return `${rows.join('\n')}${underline}\n`;
    }

    _tableHeaderChildren(props: WriteComposedItemProps<TableHeaderComposedItem>) {
        return this.writeChildren(props);
    }

    _tableHeaderCell(props: WriteComposedItemProps<TableHeaderCellComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const contents = this.getContents(children, () => this._tableHeaderCellChildren({ item, context }));
        return contents;
    }

    _tableHeaderCellChildren(props: WriteComposedItemProps<TableHeaderCellComposedItem>) {
        return this.writeChildren(props);
    }

    _tableRow(props: WriteComposedItemProps<TableRowComposedItem>, ...children: string[]) {
        const { item, context } = props;
        const cells = this.getChildren(children, () => this._tableRowChildren({ item, context }));
        return `| ${cells} |\n`;
    }

    _tableRowChildren(props: WriteComposedItemProps<TableRowComposedItem>) {
        const { item, context } = props;
        const cells = this.writeItems({ items: item.value, context });
        return cells.join(' | ');
    }

    code(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.codeChildren({ item, context, decorator, otherDecorators }));
        return `\`${contents}\``;
    }

    codeChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    delete(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.deleteChildren({ item, context, decorator, otherDecorators }));
        return `--${contents}--`;
    }

    deleteChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    emphasis(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.emphasisChildren({ item, context, decorator, otherDecorators }));
        return `*${contents}*`;
    }

    emphasisChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    insert(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.insertChildren({ item, context, decorator, otherDecorators }));
        return `++${contents}++`;
    }

    insertChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    keyboard(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.keyboardChildren({ item, context, decorator, otherDecorators }));
        return `::${contents}::`;
    }

    keyboardChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    linebreak(props: WriteDecoratorProps) {
        return `\n`;
    }

    lineBreakChildren(props: WriteDecoratorProps) {
        return null;
    }

    mark(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.markChildren({ item, context, decorator, otherDecorators }));
        return `==${contents}==`;
    }

    markChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    strong(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.strongChildren({ item, context, decorator, otherDecorators }));
        return `**${contents}**`;
    }

    strongChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    strikethrough(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.strikethroughChildren({ item, context, decorator, otherDecorators }));
        return `~~${contents}~~`;
    }

    strikethroughChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    subscript(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.subscriptChildren({ item, context, decorator, otherDecorators }));
        return `~${contents}~`;
    }

    subscriptChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    superscript(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.subscriptChildren({ item, context, decorator, otherDecorators }));
        return `^${contents}^`;
    }

    superscriptChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    underline(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.underlineChildren({ item, context, decorator, otherDecorators }));
        return `***${contents}***`;
    }

    underlineChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    variable(props: WriteDecoratorProps, ...children: string[]) {
        const { item, context, decorator, otherDecorators } = props;
        const contents = this.getContents(children, () => this.underlineChildren({ item, context, decorator, otherDecorators }));
        return `%%${contents}%%`;
    }

    variableChildren(props: WriteDecoratorProps) {
        return this.decorators({ item: props.item, decorators: props.otherDecorators, context: props.context });
    }

    write(props: WriterProps) {
        let { data, context } = props;
        context = newContext(context || {}, true);
        return this.concat(this.writeItems({ items: data, context }));
    }

    encode(text: any) {
        if ((typeof text === 'boolean') || (text === null) || (typeof text === 'undefined')) {
            return '';
        } else {
            return String(text).replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&#39;')
                .replace(/"/g, '&#34;')
                .replace(/\//, '&#x2F;');
        }
    }

    private writeChildren(props: WriteComposedItemProps<ComposedItem>) {
        const { item, context } = props;
        const isArray = Array.isArray(item?.value);
        const isString = typeof item?.value === 'string';
        if (isArray) {
            return this.concat(this.writeItems({ items: item.value as any, context }));
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
        return this.concat([this.encode(props.text)]);
    }

    private decorators(props: DecoratorProps): string {
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

    private concat(children: string[]) {
        return children.join('');
    }

    private getChildren(
        children: string | string[],
        defaultChildren: () => string | string[]
    ) {
        const isEmptyChildren = !children || (Array.isArray(children) && !children.length);
        children = isEmptyChildren ? defaultChildren() : children;
        if (Array.isArray(children)) {
            return children;
        } else if (isPopulated(children)) {
            return [children];
        } else {
            return [];
        }
    }

    private getContents(
        children: string | string[],
        defaultChildren: () => string | string[]
    ) {
        const isEmptyChildren = !children || (Array.isArray(children) && !children.length);
        children = isEmptyChildren ? defaultChildren() : children;
        return Array.isArray(children) ? children.join('') : (children || '');
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

function withChildren<T extends Function, TChildren extends Function>(fn: T, children: TChildren, writer: MarkdownWriter): T & { Children: TChildren } {
    const result: T & { Children: TChildren } = fn.bind(writer);
    result.Children = children.bind(writer);
    return result;
}

function createWriterFactory<TNode, TFragment>() {
    const writer = new MarkdownWriter();

    const createWriter = (overrides?: WriterOverrides): WriteFunction => {
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
        Variable: withChildren(writer.variable, writer.variableChildren, writer),

        Text: writer.encode.bind(writer)
    };
};

const { 
    createWriter, Anchor, Code, Component, Divider, Fragment, Image, InlineEntry, Heading, Link, List, ListItem, Panel, Paragraph,
    Table, TableBody, TableCaption, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow, InlineCode, Delete, Emphasis,
    Insert, Keyboard, Linebreak, Mark, Strong, Strikethrough, Subscript, Superscript, Underline, Variable, Text
} = createWriterFactory();

export {
    createWriter, Anchor, Code, Component, Divider, Fragment, Image, InlineEntry, Heading, Link, List, ListItem, Panel, Paragraph,
    Table, TableBody, TableCaption, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow, InlineCode, Delete, Emphasis,
    Insert, Keyboard, Linebreak, Mark, Strong, Strikethrough, Subscript, Superscript, Underline, Variable, Text
};