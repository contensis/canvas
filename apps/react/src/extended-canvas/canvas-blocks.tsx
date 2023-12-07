import {
    Code,
    CodeBlock,
    Fragment,
    FragmentBlock,
    Heading,
    HeadingBlock,
    Image,
    ImageBlock,
    List,
    ListBlock,
    ListItem,
    ListItemBlock,
    Panel,
    PanelBlock,
    Paragraph,
    ParagraphBlock,
    RenderBlockProps,
    Table,
    TableBlock
} from '@contensis/canvas-react';
import { useState, createContext, useContext, useEffect } from 'react';

declare var Prism: any;

const ParagraphContext = createContext<null | { inLead: boolean }>(null);

export function MyCode(props: RenderBlockProps<CodeBlock>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    const caption = props.block?.value?.caption;
    const copy = () => {
        setIsCopying(true);
        navigator.clipboard.writeText(props?.block?.value?.code || '');

        setTimeout(() => {
            setIsCopying(false);
        }, 3000);
    };

    const copyButtonText = isCopying ? 'Copied' : 'Copy';
    const expandButtonText = isCollapsed ? 'Expand code' : 'Collapse code';

    const toggle = () => setIsCollapsed((collapsed) => !collapsed);

    useEffect(() => {
        if (!isCollapsed) {
            Prism.highlightAll();
        }
    }, [isCollapsed]);

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    const codeElement = !!caption ? (
        <figure className="figure" style={{ display: 'block' }}>
            <Code {...props} />
            <figcaption className="figure-caption text-end">{caption}</figcaption>
        </figure>
    ) : (
        <Code {...props} />
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em' }}>
                {isCollapsed ? null : (
                    <button disabled={isCopying} onClick={copy}>
                        {copyButtonText}
                    </button>
                )}
                <button onClick={toggle}>{expandButtonText}</button>
            </div>
            {isCollapsed ? null : codeElement}
        </div>
    );
}

export function MyFragment(props: RenderBlockProps<FragmentBlock>) {
    const paragraphContext = useContext(ParagraphContext);
    return paragraphContext?.inLead ? <Fragment.Children {...props} /> : <Fragment {...props} />;
}

export function MyHeading(props: RenderBlockProps<HeadingBlock>) {
    // const cssClass = `display-${props.block?.properties?.level || '1'}`;
    // return <Heading {...props} className={cssClass} />;
    return <Heading.Children {...props} />;
}

export function MyImage(props: RenderBlockProps<ImageBlock>) {
    const caption = props.block?.value?.caption;
    return !!caption ? (
        <figure className="figure" style={{ display: 'block' }}>
            <Image {...props} className="figure-img img-fluid" />
            <figcaption className="figure-caption text-end">{caption}</figcaption>
        </figure>
    ) : (
        <Image {...props} className="img-fluid" />
    );
}

export function MyList(props: RenderBlockProps<ListBlock>) {
    const { listType } = props?.block?.properties || {};
    const cssClass = listType === 'ordered' ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return <List {...props} className={cssClass} />;
}

export function MyListItem(props: RenderBlockProps<ListItemBlock>) {
    return <ListItem {...props} className="list-group-item" />;
}

export function MyParagraph(props: RenderBlockProps<ParagraphBlock>) {
    const cssClass = props.block?.properties?.paragraphType ? 'lead' : null;
    return (
        <ParagraphContext.Provider value={{ inLead: props.block?.properties?.paragraphType === 'lead' }}>
            <Paragraph {...props} className={cssClass} />
        </ParagraphContext.Provider>
    );
}

const PanelCss: Record<string, string> = {
    info: 'alert alert-info',
    note: 'alert alert-primary',
    warning: 'alert alert-warning',
    success: 'alert alert-success',
    error: 'alert alert-danger'
};

export function MyPanel(props: RenderBlockProps<PanelBlock>) {
    const panelType = props.block?.properties?.panelType || 'info';
    return <Panel {...props} className={PanelCss[panelType]} />;
}

export function MyTable(props: RenderBlockProps<TableBlock>) {
    return <Table {...props} className="table table-striped" />;
}
