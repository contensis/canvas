# @contensis/canvas-react

Render content curated in a Contensis canvas field in your React projects.

## Installation

Install with your project's preferred package manager

```sh
npm install --save @contensis/canvas-react
```

```sh
yarn add --save @contensis/canvas-react
```

## Usage

Render canvas content with React

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RenderContextProvider, Renderer } from '@contensis/canvas-react';
import * as CanvasData from './canvas-data';

// Our React App
const App = () => {
  const [data] = useState(CanvasData.data); // Demo data

  return (
    <div className="content">
      <RenderContextProvider>
        <Renderer data={data} />
      </RenderContextProvider>
    </div>
  );
};

const element = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(element).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

```

You can override the default rendering for content blocks by adding your own render components when creating the canvas renderer

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Block, Image, RenderContextProvider, Renderer, Table } from '@contensis/canvas-react';
import * as CanvasData from './canvas-data';

const MyImage = (props: any) => {
    // Embelish the image markup if a caption is included
    const caption = props.block?.value?.caption;
    // Set a className for the image in all cases
    return !!caption ? (
        <figure className={'figure'} style={{ display: 'block' }}>
            <Image {...props} className={'figure-img img-fluid'} />
            <figcaption className={'figure-caption text-end'}>{caption}</figcaption>
        </figure>
    ) : (
        <Image {...props} className={'img-fluid'} />
    );
};

const MyTable = (props: any) => {
    // Set CSS className on tables
    return <Table {...props} className={'table table-striped'} />;
};

// Component wrapping a Renderer for simple usage
const SimpleRenderer = ({ data }: { data: Block[] }) => {
    return (
        <RenderContextProvider
            blocks={{
                _image: MyImage,
                _table: MyTable
            }}
        >
            <Renderer data={data} />
        </RenderContextProvider>
    );
};

// Our React App
const App = () => {
    const [data] = useState(CanvasData.data); // Demo data

    return (
        <div className="content">
            <SimpleRenderer data={data} />
        </div>
    );
};

const element = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(element).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

```

We can do the same for any Component fields present in the Canvas data

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Block, Image, RenderContextProvider, Renderer, Table } from '@contensis/canvas-react';
import * as CanvasData from './canvas-data';

// Render a "book" component within the canvas data
const MyBookComponent = (props: any) => {
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

// Component wrapping a customised Renderer for use in our app
const SimpleRenderer = ({ data }: { data: Block[] }) => {
    return (
        <RenderContextProvider
            components={{
                book: MyBookComponent,
            }}
        >
            <Renderer data={data} />
        </RenderContextProvider>
    );
};

// Our React App
const App = () => {
    const [data] = useState(CanvasData.data); // Demo data

    return (
        <div className="content">
            <SimpleRenderer data={data} />
        </div>
    );
};

const element = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(element).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

You try this out with the [React example project](https://github.com/contensis/canvas/tree/main/apps/react)
