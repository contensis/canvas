import Md from 'markdown-it';
import { InlineFragments, FragmentDefinition } from './fragments';

const MarkdownIt: (options: any) => any = Md;

const md = MarkdownIt({ html: true });

export function mdToHtml(text: string): string {
    return md.render(text || '');
}

InlineFragments.sort((a, b) => b.shortcut.length - a.shortcut.length).forEach((m) => {
    if (m.isMarkdownExtension) {
        // add rule at the start
        md.inline.ruler.before('text', m.tag, createExtension(m));
    }
});

const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;

function createExtension({ shortcut, tag }: FragmentDefinition) {
    return function (state: any, silent: boolean) {
        let found, token;
        const max = state.posMax;
        const start = state.pos;

        // if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
        if (state.src.substr(start, shortcut.length) !== shortcut) {
            return false;
        }
        if (silent) {
            return false;
        } // don't run any pairs in validation mode
        if (start + 2 * shortcut.length >= max) {
            return false;
        }

        state.pos = start + shortcut.length;

        while (state.pos < max) {
            // if (state.src.charCodeAt(state.pos) === 0x7E/* ~ */) {
            //     found = true;
            //     break;
            // }
            if (state.src.substr(state.pos, shortcut.length) === shortcut) {
                found = true;
                break;
            }
            state.md.inline.skipToken(state);
        }

        if (!found || start + shortcut.length === state.pos) {
            state.pos = start;
            return false;
        }

        const content = state.src.slice(start + shortcut.length, state.pos);

        // don't allow unescaped spaces/newlines inside
        // if (content.match(/(^|[^\\])(\\\\)*\s/)) {
        //     state.pos = start;
        //     return false;
        // }

        // found!
        state.posMax = state.pos;
        state.pos = start + shortcut.length;

        // Earlier we checked !silent, but this implementation does not need it
        token = state.push(`${tag}_open`, tag, 1);
        token.markup = shortcut;

        token = state.push('text', '', 0);
        token.content = content.replace(UNESCAPE_RE, '$1');

        token = state.push(`${tag}_close`, tag, -1);
        token.markup = shortcut;

        state.pos = state.posMax + shortcut.length;
        state.posMax = max;
        return true;
    };
}
