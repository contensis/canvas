import './App.css';
import { useState, createContext, useContext, useEffect, createElement } from 'react'
import * as CanvasData from './canvas-data';
import { Renderer, RenderContextProvider, Heading, Paragraph, Fragment, Table, Panel, Code, Image, List, ListItem, Strong } from '@contensis/canvas-react';
import { Block } from '@contensis/canvas-types';

declare var Prism: any;

// const ParagraphContext = createContext<null | { inLead: boolean }>(null);

export function MyHeading(props: any) {
    // const cssClass = `display-${props.block?.properties?.level || '1'}`;
    // return <Heading {...props} className={cssClass} />;
    return (
        <Heading.Children {...props} />
    )
}


// export function MyParagraph(props: any) {
//     const cssClass = props.block?.properties?.paragraphType ? 'lead' : null;
//     return (
//         <ParagraphContext.Provider value={{ inLead: (props.block?.properties?.paragraphType === 'lead') }}>
//             <Paragraph {...props} className={cssClass} />
//         </ParagraphContext.Provider>
//     );
// }

// export function MyFragment(props: any) {
//     const paragraphContext = useContext(ParagraphContext);
//     return (paragraphContext?.inLead)
//         ? (<Fragment.Children {...props} />)
//         : (<Fragment {...props} />);
// }

export function MyTable(props: any) {
    return <Table {...props} className={'table table-striped'} />
}

// const PanelCss: Record<string, string> = {
//     'info': 'alert alert-info',
//     'note': 'alert alert-primary',
//     'warning': 'alert alert-warning',
//     'success': 'alert alert-success',
//     'error': 'alert alert-danger'
// };

// export function MyPanel(props: any) {
//     const panelType = props.block?.properties?.panelType || 'info';
//     return <Panel {...props} className={PanelCss[panelType]} />;
// }

// export function MyImage(props: any) {
//     const caption = props.block?.value?.caption;
//     return !!caption
//         ? (
//             <figure className={'figure'} style={{ display: 'block' }}>
//                 <Image {...props} className={'figure-img img-fluid'} />
//                 <figcaption className={'figure-caption text-end'}>{caption}</figcaption>
//             </figure>
//         )
//         : (<Image {...props} className={'img-fluid'} />);
// }

// export function MyCode(props: any) {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isCopying, setIsCopying] = useState(false);

//     const caption = props.block?.value?.caption;
//     const copy = () => {
//         setIsCopying(true);
//         navigator.clipboard.writeText(props?.block?.value?.code || '');

//         setTimeout(() => {
//             setIsCopying(false)
//         }, 3000);
//     };

//     const copyButtonText = isCopying ? 'Copied' : 'Copy';
//     const expandButtonText = isCollapsed ? 'Expand code' : 'Collapse code';

//     const toggle = () => setIsCollapsed(collapsed => !collapsed);

//     useEffect(() => {
//         if (!isCollapsed) {
//             Prism.highlightAll();
//         }
//     }, [isCollapsed]);

//     useEffect(() => {
//         Prism.highlightAll();
//     }, []);

//     const codeElement = !!caption
//         ? (
//             <figure className={'figure'} style={{ display: 'block' }}>
//                 <Code {...props} />
//                 <figcaption className={'figure-caption text-end'}>{caption}</figcaption>
//             </figure>
//         )
//         : (<Code {...props} />);

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em' }}>
//                 {isCollapsed ? null : (<button disabled={isCopying} onClick={copy}>{copyButtonText}</button>)}
//                 <button onClick={toggle}>{expandButtonText}</button>
//             </div>
//             {isCollapsed ? null : codeElement}
//         </div>
//     );
// }

export function MyBookComponent(props: any) {
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.block?.value?.name}</h5>
                        <p className="card-text">{props.block?.value?.name}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <img src={props.block?.value?.cover} className="img-fluid rounded-start" />
                </div>
            </div>
        </div>
    );
}

export function MyAuthorComponent(props: any) {
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={props.block?.value?.cover} className="img-fluid rounded-start" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.block?.value?.name}</h5>
                        <p className="card-text">{props.block?.value?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// function MyList(props: any) {
//     const cssClass = (props?.block?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
//     return <List {...props} className={cssClass} />
// }

export function Al() {
    return <div>I am an Al component</div>
}

// export function StrongAl(props: any) {
//     // return <Strong {...props} style={{ backgroundColor: 'red'}} />;

//     return <code><Strong.Children {...props} /></code>;
// }

// function MyListItem(props: any) {
//     return <ListItem {...props} className={'list-group-item'} />
// }

function SimpleRenderer({ data }: { data: Block[] }) {
    return (
        <RenderContextProvider
            blocks={{
                _heading: MyHeading,
                _table: MyTable
            }}
            components={{
                'author': MyAuthorComponent,
                'book': MyBookComponent,
                'alTest': Al
            }}
        >
            <Renderer data={data} />
        </RenderContextProvider>)
}

// function ExtendedRenderer({ data }: { data: Block[] }) {
//     return (
//         <RenderContextProvider
//             blocks={{
//                 _code: MyCode,
//                 _fragment: MyFragment,
//                 _heading: MyHeading,
//                 _image: MyImage,
//                 _list: MyList,
//                 _listItem: MyListItem,
//                 _panel: MyPanel,
//                 _paragraph: MyParagraph,
//                 _table: MyTable
//             }}
//             components={{
//                 'author': MyAuthorComponent,
//                 'book': MyBookComponent,
//                 'alTest': Al
//             }}
//             decorators={{
//                 strong: StrongAl
//             }}
//         >
//             <Renderer data={data} />
//         </RenderContextProvider>
//     );
// }

function App() {
    const [data] = useState(CanvasData.data); // todo: load data through a rest call

    return (
        <div className="content">
            <SimpleRenderer data={data} />
        </div>
    );
}

export default App;
