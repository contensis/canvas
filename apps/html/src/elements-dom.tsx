import { h, Heading, Paragraph, Fragment, Table, Panel, Image, Code, List, ListItem } from '@contensis/canvas-html-dom';

declare global {
    namespace JSX {
        interface HTMLAttributes {
            className?: string;
            style?: Record<string, any>;
            children?: any;
        }

        interface IntrinsicElements {
            "div": HTMLAttributes;
            "figure": HTMLAttributes;
            "figcaption": HTMLAttributes;
            "h5": HTMLAttributes;
            "p": HTMLAttributes;
        }
    }
}

export function MyDomHeading(props: any) {
    const cssClass = `display-${props.item?.properties?.level || '1'}`;
    return <Heading {...props} className={cssClass} />;
}

export function MyDomParagraph(props: any) {
    if (props.item?.properties?.paragraphType === 'lede') {
        props.context.inLede = true;
    }
    const cssClass = props.item?.properties?.paragraphType ? 'lead' : null;
    return <Paragraph {...props} className={cssClass} />;
}

export function MyDomFragment(props: any) {
    return (props.context.inLede)
        ? (<Fragment.Children {...props} />)
        : (<Fragment {...props} />);
}

export function MyDomTable(props: any) {
    return <Table {...props} className={'table table-striped'} />
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

export function MyDomPanel(props: any) {
    const panelType = props.item?.properties?.panelType || 'info';
    return <Panel {...props} className={PanelCss[panelType]} />;
}

export function MyDomImage(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? (
            <figure className={'figure'} style={{ display: 'block' }}>
                <Image {...props} className={'figure-img img-fluid'} />
                <figcaption className={'figure-caption text-end'}>{caption}</figcaption>
            </figure>
        )
        : (<Image {...props} className={'img-fluid'} />);
}

export function MyDomCode(props: any) {
    const caption = props.item?.value?.caption;
    return !!caption
        ? (
            <figure className={'figure'} style={{ display: 'block' }}>
                <Code {...props} />
                <figcaption className={'figure-caption text-end'}>{caption}</figcaption>
            </figure>
        )
        : (<Code {...props} />);
}

export function MyDomBookComponent(props: any) {
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.item?.value?.name}</h5>
                        <p className="card-text">{props.item?.value?.name}</p>                        
                    </div>
                </div>
                <div className="col-md-4">
                    <img src={props.item?.value?.cover} className="img-fluid rounded-start" />
                </div>
            </div>
        </div>
    );
}

export function MyDomAuthorComponent(props: any) {
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={props.item?.value?.cover} className="img-fluid rounded-start" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.item?.value?.name}</h5>
                        <p className="card-text">{props.item?.value?.name}</p>                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MyDomList(props: any) {
    const cssClass = (props?.item?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return <List {...props} className={cssClass} />
}


export function MyDomListItem(props: any) {
    return <ListItem {...props} className={'list-group-item'} />
}
