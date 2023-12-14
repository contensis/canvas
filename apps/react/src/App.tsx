import { Block, HeadingBlock, ParagraphBlock, RenderBlockProps, RenderContextProvider, Renderer, Heading } from '@contensis/canvas-react';
import { Suspense, lazy, useState, Component, ReactNode } from 'react';
import './App.css';
import * as CanvasData from './canvas-data';
import { MyAuthorComponent, MyBookComponent } from './extended-canvas';

const MyLazyParagraph = lazy(() => (new Promise(resolve => setTimeout(resolve, 10000))).then(() => import('./Paragraph')));

const Loading = function () {
    return (<div>Loading...</div>)
}

class MyHeading extends Component<RenderBlockProps<HeadingBlock>> {

    render(): ReactNode {
        return (<Heading {...this.props} />);
    }

}

const MyParagraph = function (props: RenderBlockProps<ParagraphBlock>) {
    return (
        <Suspense fallback={<Loading />}>
            <MyLazyParagraph {...props} />
        </Suspense>
    );
}

function SimpleRenderer({ data }: { data: Block[] }) {
    return (
        <RenderContextProvider
            blocks={{
                _heading: MyHeading,
                _paragraph: MyParagraph
            }}
        >
            <Renderer data={data} />
        </RenderContextProvider>
    );
}

function VanillaRenderer({ data }: { data: Block[] }) {
    return (
        <RenderContextProvider>
            <Renderer data={data} />
        </RenderContextProvider>
    );
}

function App() {
    const [data] = useState(CanvasData.data); // todo: load data through a rest call

    return (
        <div className="content">
            {/* <VanillaRenderer data={data} /> */}
            <SimpleRenderer data={data} />
            {/* <ExtendedRenderer data={data} /> */}
        </div>
    );
}

export default App;
