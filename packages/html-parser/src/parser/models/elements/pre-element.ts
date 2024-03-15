import { CodeBlock, DEFAULT_LANGUAGE, toLanguageId } from '../../../models';
import { Attributes, Element } from '../models';
import { BlockElement } from '../block-element';
import { FigureElement } from './figure-element';

export class PreElement extends BlockElement {
    private _code: string;
    private _codeAttributes: Attributes;
    private _codeItem: CodeBlock;

    appendTo(parent: Element) {
        let language = '';
        const isCodeBlock = !!this._codeAttributes && this.context.canAddType('_code');
        if (isCodeBlock) {
            language = this.getLanguage();
        }
        if (isCodeBlock && language) {
            this._codeItem = {
                type: '_code' as const,
                id: this.id(),
                properties: this.withFriendlyId(),
                value: {
                    code: this._code,
                    language,
                    caption: this.attributes.title
                }
            };
            if (parent instanceof FigureElement) {
                parent.setWithCaption(this);
            } else {
                parent.append(this._codeItem);
            }
        } else {
            super.appendTo(parent);
        }
    }

    setCode(code: string, codeAttributes: Attributes) {
        this._code = code;
        this._codeAttributes = codeAttributes;
    }

    withCaption(caption: string) {
        return caption ? { ...this._codeItem, value: { ...this._codeItem.value, caption } } : this._codeItem;
    }

    private getLanguage() {
        let language = this.attributes['data-language'];

        if (!language && this.attributes['class']) {
            const classList = this.attributes['class'].split(' ');
            const languageClass = classList.find((className) => className?.startsWith('language-'));
            if (languageClass) {
                language = languageClass.substring(9);
            }
        }
        if (!language && this._codeAttributes?.['class']) {
            const classList = this._codeAttributes['class'].split(' ');
            const languageClass = classList.find((className) => className?.startsWith('language-'));
            if (languageClass) {
                language = languageClass.substring(9);
            }
        }
        language = toLanguageId(language);
        language = this.context.fixSetting('type.code.language', language, DEFAULT_LANGUAGE).value;
        return language;
    }
}
