import { OnCloseTag, OnEnd, OnOpenTag, OnText } from '@contensis/html-parser';
import { DomHandler } from 'htmlparser2';

type Attributes = Record<string, string>;

export class Handler extends DomHandler {
    constructor(private _onEnd: OnEnd, private _onOpenTag: OnOpenTag, private _onCloseTag: OnCloseTag, private _onText: OnText) {
        super();
    }

    onparserinit(parser: any) {}

    onreset() {}

    onend() {
        this._onEnd();
    }

    onerror(error: Error) {}

    onclosetag() {
        this._onCloseTag();
    }

    onopentag(name: string, attributes: Attributes) {
        this._onOpenTag(name, attributes);
    }

    ontext(data: string) {
        this._onText(data);
    }

    oncomment(data: string) {}

    oncommentend() {}

    oncdatastart() {}

    oncdataend() {}

    onprocessinginstruction(name: string, data: string) {}
}
