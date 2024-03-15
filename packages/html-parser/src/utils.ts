import * as XXHash from 'xxhashjs';
import { Block, ParagraphBlock, isParagraph } from './models';

interface Crypto {
    getRandomValues<T extends ArrayBufferView | null>(array: T): T;
    randomUUID?(): string;
}

interface Global {
    crypto: Crypto;
}

declare let window: Global;
declare let global: Global;

const crypto = global?.crypto ? global.crypto : window.crypto;

export function isSpacer(block: Block): block is ParagraphBlock {
    return !!(isParagraph(block) && block?.properties?.spacer);
}

const hasRandomUuid = !!('randomUUID' in crypto);

let H: any;
function hashId(key: string) {
    if (!H) {
        H = XXHash.h32(0x0);
    }
    return H.update(key).digest().toString(16);
}

export function uuid() {
    const id = hasRandomUuid
        ? crypto.randomUUID?.()
        : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
              (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
          );
    if (!id) return null;
    return hashId(id);
}

export function toFriendlyId(id: string) {
    if (!id) {
        return id;
    }
    const validChars = /[^a-zA-Z0-9 -]/g;
    id = id.replace(validChars, '');
    id = id.replace(/-/g, ' ');
    id = id.trim();
    id = (id || '').trim();
    if (!id) {
        return id;
    }

    const noStart = '0123456789 '.split('');
    if (noStart.includes(id.charAt(0))) {
        id = 'c ' + id;
    }

    id = (id || '').trim();
    if (!id) {
        return id;
    }
    id = id.toLowerCase();
    return id
        .split(' ')
        .filter((w) => !!w)
        .join('-');
}

export function concat<T>(array: T[][]): T[] {
    return new Array<T>().concat(...array);
}

export const LinkClassnames = {
    anchor: 'anchor',
    link: 'link',
    inlineEntry: 'inline-entry'
};
