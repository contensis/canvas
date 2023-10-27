import { h, heading, paragraph, fragment, table, panel, image, code, list, listItem, text } from '@contensis/canvas-html-dom';

export function myDomHeading(props: any) {
    const cssClass = `display-${props.item?.properties?.level || '1'}`;
    return heading({ ...props, className: cssClass });
}

export function myDomParagraph(props: any) {
    if (props.item?.properties?.paragraphType === 'lead') {
        props.context.inLead = true;
    }
    const cssClass = props.item?.properties?.paragraphType ? 'lead' : null;
    return paragraph({ ...props, className: cssClass });
}

export function myDomFragment(props: any) {
    return (props.context.inLead)
        ? fragment.children(props)
        : fragment(props);
}

export function myDomTable(props: any) {
    return table({ ...props, className: 'table table-striped' });
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

export function myDomPanel(props: any) {
    const panelType = props.item?.properties?.panelType || 'info';
    return panel({ ...props, className: PanelCss[panelType] });
}

export function myDomImage(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? h(
            'figure',
            {
                className: 'figure',
                style: { display: 'block' }
            },
            image({ ...props, className: 'figure-img img-fluid' }),
            h(
                'figcaption',
                {
                    className: 'figure-caption text-end'
                },
                caption
            )
        )
        : image({ ...props, className: 'img-fluid' });
}

export function myDomCode(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? h(
            'figure',
            { className: 'figure', style: { display: 'block' } },
            code({ ...props, className: 'figure-img img-fluid' }),
            h(
                'figcaption',
                { className: 'figure-caption text-end' },
                caption
            )
        )
        : code(props);
}

export function myDomBookComponent(props: any) {
    return h(
        'div',
        { className: 'card mb-3' },
        h(
            'div',
            { className: 'row g-0' },
            h(
                'div',
                { className: 'card-body' },
                h(
                    'h5',
                    { className: 'card-title' },
                    props.item?.value?.name
                ),
                h(
                    'p',
                    { className: 'card-text' },
                    props.item?.value?.name
                ),
            ),
            h(
                'div',
                { classname: 'col-md-4' },
                h(
                    'img',
                    {
                        src: props.item?.value?.cover,
                        className: 'img-fluid rounded-start'
                    }
                )
            )
        )
    );
}

export function myDomAuthorComponent(props: any) {
    return h(
        'div',
        { className: 'card mb-3' },
        h(
            'div',
            { className: 'row g-0' },
            h(
                'div',
                { classname: 'col-md-4' },
                h(
                    'img',
                    {
                        src: props.item?.value?.cover,
                        className: 'img-fluid rounded-start'
                    }
                )
            ),
            h(
                'div',
                { className: 'card-body' },
                h(
                    'h5',
                    { className: 'card-title' },
                    props.item?.value?.name
                ),
                h(
                    'p',
                    { className: 'card-text' },
                    props.item?.value?.name
                ),
            )            
        )
    );
}

export function myDomList(props: any) {
    const cssClass = (props?.item?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return list({ ...props, className: cssClass });
}


export function myDomListItem(props: any) {
    return listItem({ ...props, className: 'list-group-item' });
}
