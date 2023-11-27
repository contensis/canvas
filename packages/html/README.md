# @contensis/canvas-html

Render content curated in a Contensis canvas field to HTML in your JavaScript projects.

## Installation

Install with your project's preferred package manager

```sh
npm install --save @contensis/canvas-html
```

```sh
yarn add --save @contensis/canvas-html
```

## Usage

Render canvas content server-side

```typescript
import { createRenderer, Block } from '@contensis/canvas-html';
import express, { Request, Response } from 'express';

import { data } from './content/canvas-data'; // Demo data

// Create a renderer instance
const renderer = createRenderer();

// Get function to simplify usage in our app
const getCanvasHtml = (data: Block[]) => renderer({ data });

// Create a demo express app with ejs view engine
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
  // Convert the canvas data into an HTML string
  const content = getCanvasHtml(data);

  // Render the response with the index.ejs file template
  // - this example renders one "prop" called "content"
  res.render('pages/index', { content });
});
```

Link to [pages/index.ejs](https://github.com/contensis/canvas/blob/main/apps/node/views/pages/index.ejs) file used in this example

You can override the default rendering for content blocks by adding your own renderers when creating the canvas renderer

```typescript
import { createRenderer, image, text, Block } from '@contensis/canvas-html';

// Custom renderer for image content within the canvas data
const myHtmlImage = (props: any) => {
  // Embelish the image markup if a caption is included
  const caption = props.block?.value?.caption;
  // Set a className for the image in all cases
  return !!caption
    ? `
    <figure class="figure" style="display: block">
        ${image({ ...props, className: 'figure-img img-fluid' })}
        <figcaption class="figure-caption text-end">
            ${text(caption)}
        </figcaption>
    </figure>
        `
    : image({ ...props, className: 'img-fluid' });
};

// Create a renderer instance, setting a custom renderer for images
const renderer = createRenderer({
  blocks: {
    _image: myHtmlImage
  }
});

// Get function to simplify usage in our app
export const getCanvasHtml = (data: Block[]) => renderer({ data });
```

We can do the same for any Component fields present in the Canvas data

```typescript
import { createRenderer, attr, text, Block } from '@contensis/canvas-html';

// Render a "book" component within the canvas data
const myHtmlBookComponent = (props: any) => `
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

// Create a renderer instance, supplying a renderer for any "book" components
const renderer = createRenderer({
  components: {
    book: myHtmlBookComponent
  }
});

// Get function to simplify usage in our app
export const getCanvasHtml = (data: Block[]) => renderer({ data });
```

We can combine all the above into a more complete example with the [Node.js example project](https://github.com/contensis/canvas/tree/main/apps/node)
