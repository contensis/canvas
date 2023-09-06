import './App.scss';
import { createSignal, createContext, useContext, Show, createEffect } from 'solid-js';
import * as CanvasData from './canvas-data';
import { Writer, WriteContextProvider, Heading, Paragraph, Fragment, Table, Panel, Code, Image, List, ListItem } from '@contensis/canvas-solid-js';

declare var Prism: any;

const ParagraphContext = createContext<null | { inLead: boolean }>(null);

function MyHeading(props: any) {
    const cssClass = () => `display-${props.item?.properties?.level || '1'}`;
    return <Heading {...props} class={cssClass()} />;
}

function MyParagraph(props: any) {
    const cssClass = () => props.item?.properties?.paragraphType ? 'lead' : null;
    return (
        <ParagraphContext.Provider value={{ inLead: (props.item?.properties?.paragraphType === 'lead') }}>
            <Paragraph {...props} class={cssClass()} />
        </ParagraphContext.Provider>
    );
}

function MyFragment(props: any) {
    const paragraphContext = useContext(ParagraphContext);
    return (paragraphContext?.inLead)
        ? (<Fragment.Children {...props} />)
        : (<Fragment {...props} />);
}

function MyTable(props: any) {
    return <Table {...props} class={'table table-striped'} />
}

const PanelCss: Record<string, string> = {
    'info': 'alert alert-info',
    'note': 'alert alert-primary',
    'warning': 'alert alert-warning',
    'success': 'alert alert-success',
    'error': 'alert alert-danger'
};

function MyPanel(props: any) {
    const panelType = () => props.item?.properties?.panelType || 'info';
    const cssClass = () => PanelCss[panelType()]
    return <Panel {...props} class={cssClass()} />;
}

function MyImage(props: any) {
    const caption = props.item?.value?.caption;
    return (
        <Show when={!!caption} fallback={<Image {...props} class={'img-fluid'} />}>
            <figure class={'figure'} style="display: block">
                <Image {...props} class={'figure-img img-fluid'} />
                <figcaption class={'figure-caption text-end'}>{caption}</figcaption>
            </figure>
        </Show>
    );
}

function MyCode(props: any) {
    const [isCollapsed, setIsCollapsed] = createSignal(false);
    const [isCopying, setIsCopying] = createSignal(false);

    const caption = props.item?.value?.caption;
    const copy = () => {
        setIsCopying(true);
        navigator.clipboard.writeText(props?.item?.value?.code || '');

        setTimeout(() => {
            setIsCopying(false)
        }, 3000);
    };

    const copyButtonText = () => isCopying() ? 'Copied' : 'Copy';

    const expandButtonText = () => isCollapsed() ? 'Expand code' : 'Collapse code';

    const toggle = () => setIsCollapsed(collapsed => !collapsed);

    createEffect(() => {
        if (!isCollapsed()) {
            Prism.highlightAll();
        }
    });

    return (
        <div>
            <div style="display: flex; justify-content: flex-end; gap: 1em;">
                <Show when={!isCollapsed()}>
                    <button disabled={isCopying()} onClick={copy}>{copyButtonText()}</button>
                </Show>
                <button onClick={toggle}>{expandButtonText()}</button>
            </div>
            <Show when={!isCollapsed()}>
                <Show when={!!caption} fallback={<Code {...props} />}>
                    <figure class={'figure'} style="display: block">
                        <Code {...props} />
                        <figcaption class={'figure-caption text-end'}>{caption}</figcaption>
                    </figure>
                </Show>
            </Show>
        </div>
    );
}

export function MyBookComponent(props: any) {
    return (
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{props.item?.value?.name}</h5>
                        <p class="card-text">{props.item?.value?.name}</p>                        
                    </div>
                </div>
                <div class="col-md-4">
                    <img src={props.item?.value?.cover} class="img-fluid rounded-start" />
                </div>
            </div>
        </div>
    );
}

export function MyAuthorComponent(props: any) {
    return (
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src={props.item?.value?.cover} class="img-fluid rounded-start" />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{props.item?.value?.name}</h5>
                        <p class="card-text">{props.item?.value?.name}</p>                        
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyList(props: any) {
    const cssClass = () => (props?.item?.properties?.listType === 'ordered') ? 'list-group list-group-flush list-group-numbered' : 'list-group list-group-flush';
    return <List {...props} class={cssClass()} />
}


function MyListItem(props: any) {
    return <ListItem {...props} class={'list-group-item'} />
}

const App = () => {
    const [data] = createSignal(CanvasData.data);

    return (
        <div class="content">
            <WriteContextProvider items={{
                _code: MyCode,           
                _fragment: MyFragment,
                _heading: MyHeading,
                _image: MyImage,
                _list: MyList,
                _listItem: MyListItem,
                _panel: MyPanel,
                _paragraph: MyParagraph,
                _table: MyTable
            }}
            components={{
                'author': MyAuthorComponent,
                'book': MyBookComponent
            }}>
                <Writer data={data()} />
            </WriteContextProvider>
        </div>
    );
};

export default App;
