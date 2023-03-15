import { h, Heading, Paragraph, Fragment, Table, Panel, Image, Code, List, ListItem } from '@contensis/canvas-html';

export function MyHeading(props: any) {
    const cssClass = `display-${props.item?.properties?.level || '1'}`;
    return Heading({ ...props, className: cssClass });
}

export function MyParagraph(props: any) {
    if (props.item?.properties?.paragraphType === 'lede') {
        props.context.inLede = true;
    }
    const cssClass = props.item?.properties?.paragraphType ? 'lead' : null;
    return Paragraph({ ...props, className: cssClass });
}

export function MyFragment(props: any) {
    return (props.context.inLede)
        ? Fragment.Children(props)
        : Fragment(props);
}

export function MyTable(props: any) {
    return Table({ ...props, className: 'table table-striped' });
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

export function MyPanel(props: any) {
    const panelType = props.item?.properties?.panelType || 'info';
    return Panel({ ...props, className: PanelCss[panelType] });
}

export function MyImage(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? h(
            'figure',
            {
                className: 'figure',
                style: { display: 'block' }
            },
            Image(props),
            h(
                'figcaption',
                {
                    className: 'figure-caption text-end',
                    style: { display: 'block' }
                },
                caption
            )
        )
        : Image(props);
}

export function MyCode(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? h(
            'figure',
            {
                className: 'figure',
                style: { display: 'block' }
            },
            Code(props),
            h(
                'figcaption',
                {
                    className: 'figure-caption text-end',
                    style: { display: 'block' }
                },
                caption
            )
        )
        : Code(props);
}

export function MyBookComponent(props: any) {
    return h('div', { className: 'card mb-3' },
        h('div', { className: 'row g-0' },
            h('div', { className: 'col-md-4' },
                h('img', { className: 'img-fluid rounded-start', src: props.item?.value?.cover })
            ),
            h('div', { className: 'col-md-8' },
                h('div', { className: 'card-body' },
                    h('h5', { className: 'card-title' }, props.item?.value?.name),
                    h('p', { className: 'card-text' }, props.item?.value?.name)
                )
            )
        )
    );
}

export function MyAuthorComponent(props: any) {
    return h('div', { className: 'card mb-3' },
        h('div', { className: 'row g-0' },
            h('div', { className: 'col-md-8' },
                h('div', { className: 'card-body' },
                    h('h5', { className: 'card-title' }, props.item?.value?.name),
                    h('p', { className: 'card-text' }, props.item?.value?.name)
                )
            ),
            h('div', { className: 'col-md-4' },
                h('img', { className: 'img-fluid rounded-start', src: props.item?.value?.cover })
            )
        )
    );
}

export function MyList(props: any) {
    const cssClass = (props?.item?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return List({
        ...props,
        className: cssClass
    });
}


export function MyListItem(props: any) {
    return ListItem({
        ...props,
        className: 'list-group-item'
    });
}
