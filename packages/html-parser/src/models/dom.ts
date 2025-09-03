import { DecoratorType, ListType } from './models';

export const HEADING_TAGS: Record<'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6', number> = {
    H1: 1,
    H2: 2,
    H3: 3,
    H4: 4,
    H5: 5,
    H6: 6
};

export const LIST_TAGS: Record<'OL' | 'UL', ListType> = {
    OL: 'ordered',
    UL: 'unordered'
};

export const DECORATOR_TAGS: Record<string, DecoratorType> = {
    ABBR: 'abbreviation',
    CODE: 'code',
    DEL: 'delete',
    EM: 'emphasis',
    INS: 'insert',
    KBD: 'keyboard',
    MARK: 'mark',
    S: 'strikethrough',
    STRONG: 'strong',
    SUB: 'subscript',
    SUP: 'superscript',
    U: 'underline',
    VAR: 'variable'
};

export const IGNORE_TAGS: Record<string, boolean> = {
    HEAD: true,
    SCRIPT: true,
    STYLE: true,
    META: true,
    TITLE: true,
    LINK: true,
    SVG: true,
    PATH: true,
    G: true,
    TEMPLATE: true
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
export const BLOCK_TAGS: Record<string, boolean> = {
    ADDRESS: true,
    ARTICLE: true,
    ASIDE: true,
    BLOCKQUOTE: true,
    DETAILS: true,
    DIALOG: true,
    DD: true,
    DIV: true,
    DL: true,
    DT: true,
    FIELDSET: true,
    FIGCAPTION: true,
    FIGURE: true,
    FOOTER: true,
    FORM: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HEADER: true,
    HGROUP: true,
    HR: true,
    LI: true,
    MAIN: true,
    NAV: true,
    OL: true,
    P: true,
    PRE: true,
    SECTION: true,
    TABLE: true,
    UL: true
};
