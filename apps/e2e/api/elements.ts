import { h, Heading, Table, Panel, Image, Code } from '@contensis/canvas-html';

export function MyHeading(props: any) {
    const cssClass = `display-${props.block?.properties?.level || '1'}`;
    return Heading({ ...props, className: cssClass });
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
    const panelType = props.block?.properties?.panelType || 'info';
    return Panel({ ...props, className: PanelCss[panelType] });
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
            Image({ ...props, style: 'max-width: 700px;' }),
            h(
                'figcaption',
                {
                    className: 'figure-caption text-end',
                    style: { display: 'block' }
                },
                caption
            )
        )
        : Image({ ...props, style: 'max-width: 700px;' });
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
