import './App.css';
import { useState } from 'react';
import { Renderer, RenderContextProvider, Block } from '@contensis/canvas-react';

import * as CanvasData from './canvas-data';

import { ExtendedRenderer, MyHeading, MyTable, MyAuthorComponent, MyBookComponent } from './extended-canvas';

function SimpleRenderer({ data }: { data: Block[] }) {
    return (
        <RenderContextProvider
            blocks={{
                _heading: MyHeading,
                _table: MyTable
            }}
            components={{
                author: MyAuthorComponent,
                book: MyBookComponent
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
