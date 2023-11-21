import { h } from 'vue';
import * as CanvasData from './canvas-data';
import { createElements, createRendererFactory } from '@contensis/canvas-dom';

function contents(context: any) {
    return (typeof context.slots.default === 'function')
        ? context.slots.default()
        : context.slots.default;
}

// todo: remove as any
const VueFragment = (props: any, context: any) => {
    return contents(context);
}

const Text = (text: any) => text;

const createRenderer = createRendererFactory(h as any, VueFragment as any, Text);
const { heading, paragraph, fragment, table, panel, image, code } = createElements();

// const { createRenderer, Heading, Paragraph, Fragment, Table, Panel, Code, Image } = createElements(h, VueFragment as any, Text);


function MyHeading(props: any) {
    const cssClass = `display-${props.block?.properties?.level || '1'}`;
    return heading({ ...props, className: cssClass });
}

export function MyParagraph(props: any) {
    if (props.block?.properties?.paragraphType === 'lead') {
        props.context.inLead = true;
    }
    const cssClass = props.block?.properties?.paragraphType ? 'lead' : null;
    return paragraph({ ...props, className: cssClass });
}

export function MyFragment(props: any) {
    return (props.context.inLead)
        ? fragment.children(props)
        : fragment(props);
}

export function MyTable(props: any) {
    return table({ ...props, className: 'table table-striped' });
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

export function MyPanel(props: any) {
    const panelType = props.block?.properties?.panelType || 'info';
    return panel({ ...props, className: PanelCss[panelType] });
}

export function MyImage(props: any) {
    const caption = props.block?.value?.caption;
    return !!caption
        ? h(
            'figure',
            {
                className: 'figure',
                style: { display: 'block' }
            },
            () => [
                image(props),
                h(
                    'figcaption',
                    {
                        className: 'figure-caption text-end',
                        style: { display: 'block' }
                    },
                    caption
                )
            ]
        )
        : image(props);
}

export function MyCode(props: any) {
    const caption = props.block?.value?.caption;
    return !!caption
        ? h(
            'figure',
            {
                className: 'figure',
                style: { display: 'block' }
            },
            () => [
                code(props),
                h(
                    'figcaption',
                    {
                        className: 'figure-caption text-end',
                        style: { display: 'block' }
                    },
                    caption
                )
            ]
        )
        : code(props);
}

export function MyBookComponent(props: any) {
    return h('div', { className: 'card mb-3' },
        [
            h('div', { className: 'row g-0' }, [
                h('div', { className: 'col-md-4' }, [
                    h('img', { className: 'img-fluid rounded-start', src: props.block?.value?.cover }, [])
                ]),
                h('div', { className: 'col-md-8' }, [
                    h('div', { className: 'card-body' }, [
                        h('h5', { className: 'card-title' }, [props.block?.value?.name]),
                        h('p', { className: 'card-text' }, [props.block?.value?.name])
                    ])
                ])
            ])
        ]
    )
}

export function MyAuthorComponent(props: any) {
    return h('div', { className: 'card mb-3' },
        [
            h('div', { className: 'row g-0' }, [
                h('div', { className: 'col-md-8' }, [
                    h('div', { className: 'card-body' }, [
                        h('h5', { className: 'card-title' }, [props.block?.value?.name]),
                        h('p', { className: 'card-text' }, [props.block?.value?.name])
                    ])
                ]),
                h('div', { className: 'col-md-4' }, [
                    h('img', { className: 'img-fluid rounded-start', src: props.block?.value?.cover }, [])
                ])
            ])
        ]
    )
}

const renderer = createRenderer({
    blocks: {
        _code: MyCode,
        _heading: MyHeading,
        _paragraph: MyParagraph,
        _fragment: MyFragment,
        _table: MyTable,
        _panel: MyPanel,
        _image: MyImage
    },
    components: {
        'author': MyAuthorComponent,
        'book': MyBookComponent
    }
});

export default {
    render() {
        return h(
            'div',
            { className: 'content' },
            renderer({ data: CanvasData.data })
        );
    }
}