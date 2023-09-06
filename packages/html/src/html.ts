type Child = string | number | boolean;

const DOM_PROPERTIES = {
    acceptCharset: 'accept-charset',
    accessKey: 'accesskey',
    autoComplete: 'autocomplete',
    autoFocus: 'autofocus',
    autoPlay: 'autoplay',
    charSet: 'charset',
    className: 'class',
    colSpan: 'colspan',
    contentEditable: 'contenteditable',
    dateTime: 'datetime',
    encType: 'enctype',
    formAction: 'formaction',
    hrefLang: 'hreflang',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    maxLength: 'maxlength',
    noValidate: 'novalidate',
    readOnly: 'readonly',
    rowSpan: 'rowspan',
    spellCheck: 'spellcheck',
    srcDoc: 'srcdoc',
    srcSet: 'srcset',
    tabIndex: 'tabindex',
    useMap: 'usemap'
};

const BOOLEAN_ATTRIBUTES = {
    'autofocus': true,
    'checked': true,
    'disabled': true,
    'hidden': true,
    'multiple': true,
    'readonly': true,
    'required': true,
    'selected': true
};

const VOID_TAGS = {
    'area': true,
    'base': true,
    'br': true,
    'col': true,
    'command': true,
    'embed': true,
    'hr': true,
    'img': true,
    'input': true,
    'keygen': true,
    'link': true,
    'meta': true,
    'param': true,
    'source': true,
    'track': true,
    'wbr': true
};

function join(child: Child | Child[]) {
    if (Array.isArray(child)) {
        return child.map(nestedChild => join(nestedChild)).join('');
    } else if (typeof child === 'string') {
        return child;
    } else if ((typeof child === 'boolean') || (child === null) || (typeof child === 'undefined')) {
        return '';
    } else {
        return String(child);
    }
}

type Type = string | ((props?: Record<string, any>) => string);

export function h(type: Type, props?: Record<string, any>, ...children: Child[]) {
    if (typeof type === 'function') {
        props = props || {};
        if (children.length) {
            props = {
                ...props,
                children
            };
        }
        return type(props);
    }
    const attributes = toHtmlAttributes(props);
    let attributeString = toAttributesString(attributes);
    attributeString = !!attributeString ? ` ${attributeString}` : '';
    if (isVoid(type)) {
        return `<${type}${attributeString}>`;
    }

    const contents = join(children);
    return `<${type}${attributeString}>${contents}</${type}>`;
}

h.fragment = function (props?: Record<string, any> & { children: Child[] }) {
    return props?.children ? join(props.children) : '';
};

h.text = function (text: any) {
    if ((typeof text === 'boolean') || (text === null) || (typeof text === 'undefined')) {
        return '';
    } else {
        return htmlEncode(String(text));
    }
}

function toHtmlAttributes(properties: Record<string, any>) {
    if (!properties) {
        return undefined;
    }
    const keys = Object.keys(properties);
    if (!keys.length) {
        return undefined;
    }
    return keys.reduce((prev, key) => {
        let value = properties[key];
        if ((value === null) || (typeof value === 'undefined')) {
            return prev;
        }
        const name = DOM_PROPERTIES[key] || key;
        if (name === 'style') {
            prev[name] = styleToString(value);
        } else if (BOOLEAN_ATTRIBUTES[name]) {
            if (value) {
                prev[name] = name;
            }
        } else {
            prev[name] = value;
        }
        return prev;
    }, {} as Record<string, any>);
}

function styleToString(style: any): any {
    if (!style || (typeof style === 'string')) {
        return style;
    }
    return Object.keys(style)
        .map(key => [toSnakeCase(key), style[key]].join(': '))
        .join(';');
}

function toSnakeCase(value: any) {
    return `${String(value)}`.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`);
}

function toAttributesString(attributes: Record<string, any>) {
    if (!attributes) {
        return '';
    }
    const keys = Object.keys(attributes);
    if (!keys.length) {
        return '';
    }
    return keys.map(key => {
        return BOOLEAN_ATTRIBUTES[key]
            ? key
            : `${key}="${attributes[key]}"`
    }).join(' ');
}

function isVoid(tagName: string) {
    return !!VOID_TAGS[tagName];
}

const encodeMap = {
    161: '&iexcl;',
    162: '&cent;',
    163: '&pound;',
    164: '&curren;',
    165: '&yen;',
    166: '&brvbar;',
    167: '&sect;',
    168: '&uml;',
    169: '&copy;',
    170: '&ordf;',
    171: '&laquo;',
    172: '&not;',
    173: '&shy;',
    174: '&reg;',
    175: '&macr;',
    176: '&deg;',
    177: '&plusmn;',
    178: '&sup2;',
    179: '&sup3;',
    180: '&acute;',
    181: '&micro;',
    182: '&para;',
    184: '&cedil;',
    185: '&sup1;',
    186: '&ordm;',
    187: '&raquo;',
    188: '&frac14;',
    189: '&frac12;',
    190: '&frac34;',
    191: '&iquest;',
    215: '&times;',
    247: '&divide;',
    8211: '&ndash;',
    8212: '&mdash;',
    8216: '&lsquo;',
    8217: '&rsquo;',
    8218: '&sbquo;',
    8220: '&ldquo;',
    8221: '&rdquo;',
    8222: '&bdquo;',
    8226: '&bull;',
    8249: '&lsaquo;',
    8250: '&rsaquo;',
    8364: '&euro;',
    8482: '&trade;'
};

const SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const NON_ALPHANUMERIC_REGEXP = /([^#-~ |!])/g;

// this is duplicated in the markdown writer so any changes need to be done there as well
function htmlEncode(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/[ ]{2,}/g, function (match: string) {
            return ' ' + '&nbsp;'.repeat(match.length - 1);
        })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/`/g, '&grave;')
        .replace(SURROGATE_PAIR_REGEXP, function (match: string) {
            const hi = match.charCodeAt(0);
            const low = match.charCodeAt(1);
            return '&#' + ((hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000) + ';';
        })
        .replace(NON_ALPHANUMERIC_REGEXP, function (match: string) {
            const charCode = match.charCodeAt(0);
            return encodeMap[charCode] || `&#${charCode};`;
        });
}