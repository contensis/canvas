import { heading, paragraph, fragment, table, panel, image, code, list, listItem, text, attr } from '@contensis/canvas-html';

export function myHtmlHeading(props: any) {
    const cssClass = `display-${props.block?.properties?.level || '1'}`;
    return heading({ ...props, className: cssClass });
}

export function myHtmlParagraph(props: any) {
    if (props.block?.properties?.paragraphType === 'lead') {
        props.context.inLead = true;
    }
    const cssClass = props.block?.properties?.paragraphType ? 'lead' : null;
    return paragraph({ ...props, className: cssClass });
}

export function myHtmlFragment(props: any) {
    return (props.context.inLead)
        ? fragment.children(props)
        : fragment(props);
}

export function myHtmlTable(props: any) {
    return table({ ...props, className: 'table table-striped' });
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

export function myHtmlPanel(props: any) {
    const panelType = props.block?.properties?.panelType || 'info';
    return panel({ ...props, className: PanelCss[panelType] });
}

export function myHtmlImage(props: any) {
    const caption = props.block?.value?.caption;
    return !!caption
        ? `
            <figure class="figure" style="display: block">
                ${image({ ...props, className: 'figure-img img-fluid' })}
                <figcaption class="figure-caption text-end">${text(caption)}</figcaption>
            </figure>
        `
        : image({ ...props, className: 'img-fluid' });
}

export function myHtmlCode(props: any) {
    const caption = props.block?.value?.caption;
    return !!caption
        ? `
            <figure class="figure" style="display: block">
                ${code(props)}
                <figcaption class="figure-caption text-end">${text(caption)}</figcaption>
            </figure>
        `
        : code(props);
}

export function myHtmlBookComponent(props: any) {    
    return `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${text(props.block?.value?.name)}</h5>
                        <p class="card-text">${text(props.block?.value?.name)}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <img src="${attr(props.block?.value?.cover)}" class="img-fluid rounded-start" />
                </div>
            </div>
        </div>
    `;
}

export function myHtmlAuthorComponent(props: any) {
    return `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${attr(props.block?.value?.cover)}" class="img-fluid rounded-start" />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${text(props.block?.value?.name)}</h5>
                        <p class="card-text">${text(props.block?.value?.name)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function myHtmlList(props: any) {
    const cssClass = (props?.block?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return list({ ...props, className: cssClass });
}


export function myHtmlListItem(props: any) {
    return listItem({ ...props, className: 'list-group-item' });
}
