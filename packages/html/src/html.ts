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

// todo: what about html encoding of text content????
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
