
type Child = string | number | boolean | Node;

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

function append(parent: Node, child: Child | Child[]) {
    if (Array.isArray(child)) {
        child.forEach(nestedChild => append(parent, nestedChild));
    } else if (typeof child === 'string') {
        parent.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
        parent.appendChild(child);
    } else if ((typeof child === 'boolean') || (child === null) || (typeof child === 'undefined')) {
        //  do nothing
        // <>{condition && <a>Display when condition is true</a>}</>
        // if condition is false, the child is a boolean, but we don't want to display anything
    } else {
        parent.appendChild(document.createTextNode(String(child)));
    }
}

export function h(type: string | Function, props?: Record<string, any>, ...children: Child[]): Node {
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
    const el = document.createElement(type);
    setProperties(el, props);
    if (!isVoid(type)) {
        append(el, children);
        el.normalize();
    }
    return el;
}

h.fragment = function (props?: Record<string, any> & { children: Child[] }) {
    const fragment = document.createDocumentFragment();
    append(fragment, props?.children);
    fragment.normalize();
    return fragment;
};

function setProperties(el: Node, properties: Record<string, any>) {
    if (!properties) {
        return;
    }
    const keys = Object.keys(properties);
    if (!keys.length) {
        return;
    }

    keys.forEach(key => {
        let value = properties[key];
        if ((value !== null) && (typeof value !== 'undefined')) {
            if (key === 'style') {
                const styleKeys = Object.keys(value);
                styleKeys.forEach(styleKey => {
                    (el as HTMLElement).style[styleKey] = value[styleKey];
                });
            } else if (key.includes('-')) {
                (el as HTMLElement).setAttribute(key, value);
            } else {
                el[key] = value;
            }
        }
    });
}

function isVoid(tagName: string) {
    return !!VOID_TAGS[tagName];
}