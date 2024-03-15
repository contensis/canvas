import { ICanvasWalker, OnCloseTag, OnEnd, OnOpenTag, OnText } from '@contensis/html-parser';
import { Parser } from 'htmlparser2';
import { Handler } from './handler';

function empty() {}

export class HtmlWalker implements ICanvasWalker {
    private _onEnd!: OnEnd;
    private _onOpenTag!: OnOpenTag;
    private _onCloseTag!: OnCloseTag;
    private _onText!: OnText;

    constructor(private html: string) {}

    walk(): void {
        const handler = new Handler(this._onEnd || empty, this._onOpenTag || empty, this._onCloseTag || empty, this._onText || empty);
        const parser = new Parser(handler);
        parser.write(this.html);
        parser.end();
    }

    onEnd(onEnd: OnEnd): void {
        this._onEnd = onEnd;
    }

    onOpenTag(onOpenTag: OnOpenTag): void {
        this._onOpenTag = onOpenTag;
    }

    onCloseTag(onCloseTag: OnCloseTag): void {
        this._onCloseTag = onCloseTag;
    }

    onText(onText: OnText): void {
        this._onText = onText;
    }
}
