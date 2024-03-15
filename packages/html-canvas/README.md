# @contensis/html-canvas

Convert HTML content to Contensis canvas

## Installation

Install with your project's preferred package manager

```sh
npm install --save @contensis/html-canvas
```

```sh
yarn add --save @contensis/html-canvas
```

## Usage

Convert a simple HTML snippet to Canvas JSON

```typescript
import { parseHtml } from '@contensis/html-canvas';

const html = '<h1>test</h1>';
const canvas = await parseHtml(html);

// Output raw canvas to console
console.log(JSON.stringify(canvas, null, 2));
```

Create a HTML Parser, passing in configuration to allow the parser to prepare the canvas according to a specific field configuration in a content type.

Prepare a Delivery API client so the parser can find the field configuration and attempt to match external resources (such as images and links) to existing
content in this Contensis project.

```typescript
import { createHtmlParser } from '@contensis/html-canvas';
import { Client } from 'contensis-delivery-api';

const html = '<h1>test</h1>';

// Connect a Delivery API client
const client = Client.create({
  clientDetails: { clientId: '', clientSecret: '' },
  clientType: 'client_credentials',
  projectId: '',
  rootUrl: '',
  versionStatus: 'latest'
});

// Create a HTML parser targeting the content type and field with the right Canvas configuration
const { parse } = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });

// Use the parse function returned above to parse the HTML string and generate canvas JSON
const canvas = await parse(html);
```

## Adding complexity

A more complete example of converting existing entry data in a rich text field type to a canvas representation

```typescript
import { createHtmlParser, Block } from '@contensis/html-canvas';
import { Client, ZenqlQuery } from 'contensis-delivery-api';

// Connect a Delivery API client
const client = Client.create({
  clientDetails: { clientId: '', clientSecret: '' },
  clientType: 'client_credentials',
  projectId: '',
  rootUrl: '',
  versionStatus: 'latest'
});

// Create a HTML parser targeting the content type and field with the right Canvas configuration
const { parse } = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });

// Get some entries containing richText field
const query = new ZenqlQuery(`sys.contentTypeId = document AND richText EXISTS`);
query.pageSize = 10;
const entries = await client.entries.search(query);

const canvasData: { [id: string]: Block[] } = {};

// Iterate through the page of search results
for (const entry of entries.items) {
  if (entry.richText) {
    // Parse the richText field content and convert to Canvas
    const canvas = await parse(entry.richText);

    // Keep a note of the updated entry data
    canvasData[entry.sys.id] = canvas;
  }
}

for (const [entryId, canvas] of Object.entries(canvasData)) {
  // Log canvas data to console
  console.log(`Entry: ${entryId}, Canvas: \n${JSON.stringify(canvas, null, 2)}`);
}
```

Further customisation is available by overriding specific parts of the parser and call the canvas `parse` function directly

```tsx
// Import the standalone `parse` method, and the `DataResolver` interface
import { DataResolver, createHtmlParser, parse } from '@contensis/html-canvas';
import { Client } from 'contensis-delivery-api';

const html = '<h1>test</h1>';

// Connect a Delivery API client
const client = Client.create({
  clientDetails: { clientId: '', clientSecret: '' },
  clientType: 'client_credentials',
  projectId: '',
  rootUrl: '',
  versionStatus: 'latest'
});

// Create a HTML parser targeting the content type and field with the right Canvas configuration
// - returning the base elements to call the raw `parse` function
const { parserSettings, resolver, settings } = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });

// Create a class implementing DataResolver, it needs to implement three methods for locating external resources
class CustomResolver implements DataResolver {
  constructor(public client: Client) {
    // Add what you need in the constructor here when an external reference is found
    // and your `get...ByPath` method is called e.g. API client
  }

  async getAssetByPath(path: string) {
    const asset = await resolver.getAssetByPath(path);
    if (!asset) {
      // implement custom logic for resolving / handling asset links
    }
    return asset;
  }
  async getEntryByPath(path: string) {
    return resolver.getEntryByPath(path);
  }
  async getNodeByPath(path: string) {
    const node = resolver.getNodeByPath(path);
    if (!node) {
      // implement custom logic for handling unresolved site view nodes
    }
    return node;
  }
}

// Disallow element type heading (for example)
settings['type.heading'] = false;

// Instantiate our custom resolver so it is ready to use
const customResolver = new CustomResolver(client);

// Call the imported `parse` function providing all the required arguments
const canvas = await parse(html, settings, parserSettings, resolver);
```

You try this out with the [HTML-to-canvas example project](https://github.com/contensis/canvas/tree/main/apps/html-canvas)

## Development

Clone the [@contenis/canvas](https://github.com/contensis/canvas) repository and run `npm install`, `cd` into the `packages/html-canvas` directory and run `npm run build` then `npm run test:mock` to run through the tests

### Testing

`npm test` will run the tests against a real API, for this you will need to create a `.env` file in the package root with the following details in it:

```
rootUrl=""
projectId=""
clientId=""
sharedSecret=""
```

#### Adding new tests

You will need to first ensure the `.env` file mentioned above is in place and all the existing tests are passing with `npm test`

When the new test(s) are added and passing:
* Run the tests again with `npm run test:record` *(you can limit this to run specific tests with `describe.only(...` in mocha)
   - The API calls made for this test run will be saved in JSON files for use later as mocks.
* Run the entire test suite again with `npm run test:mock` so we can see all tests working with the new mock data.
* Commit the tests and JSON mocks.