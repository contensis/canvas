import { Block } from '../models';
import { Element, Attributes, RootElement, findElement, Context, ICanvasParser, ICanvasWalker, ICanvasDataProvider } from './models';

export class CanvasParser implements ICanvasParser<Block[]> {
    private document!: RootElement;
    private root!: Element;
    private context!: Context;
    private stack: Element[] = [];
    private current!: Element;

    constructor(private walker: ICanvasWalker, private dataProvider: ICanvasDataProvider) {}

    parse() {
        this.context = new Context(this.dataProvider);
        this.document = new RootElement('#document', {}, this.context);
        this.root = this.document;
        this.current = this.document;

        this.walker.onEnd(() => this.onEnd());
        this.walker.onOpenTag((name, attributes) => this.onOpenTag(name, attributes));
        this.walker.onCloseTag(() => this.onCloseTag());
        this.walker.onText((text) => this.onText(text));

        this.walker.walk();

        return this.root.export();
    }

    private onEnd(): void {}

    private onOpenTag(name: string, attributes: Attributes): void {
        const ElementType = findElement(name);
        const element: Element = new ElementType(name, attributes, this.context);
        this.addToStack(element);
    }

    private onCloseTag(): void {
        const node = this.current;
        const parent = this.stack.pop();
        if (parent) {
            node.appendTo(parent);
            this.current = parent;
        }
    }

    private onText(text: string): void {
        this.current.addText(text);
    }

    private addToStack(element: Element) {
        const parent = this.current;
        this.stack.push(parent);
        this.current = element;
    }
}
