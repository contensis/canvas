import 'dotenv/config';
import { CanvasField, DataResolver, createHtmlParser, parse, parseHtml } from '@contensis/html-canvas';
import { Client } from 'contensis-delivery-api';

let n = 0;
const output = (json: any) => console.log(`Test ${++n}\n\n${JSON.stringify(json, null, 2)}\n\n  ---------------`);
process.on('uncaughtException', (ex) => console.log(`Failed at test ${++n} ....\n\n`, ex));

const html = '<h1>test</h1>';

// - 1 ----------------------------------------
// Simplest no-nonsense parser, no rules followed, no existing content resolved
// Best for a quick test
const canvas = await parseHtml(html);
output(canvas);

// - 2 ----------------------------------------
// Create a simple parser instance and chain callbacks
// This is just different syntax that was pre async/await and is still seen sometimes
createHtmlParser()
    .then((parser) => parser.parse(html))
    .then((canvas) => {
        output(canvas);
    });

// - 3 ----------------------------------------
// Complete parser, canvas field will be located in the given contentTypeId to tailor the canvas output
// Best for a complete conversion of existing content
//   - simple implementation providing a connected client to resolve field configuration and existing content
//   - this is the one we will use with the CLI
const client = new Client({
    clientDetails: { clientId: process.env.clientId as string, clientSecret: process.env.sharedSecret as string },
    clientType: 'client_credentials',
    projectId: process.env.projectId,
    rootUrl: process.env.rootUrl,
    versionStatus: 'latest'
});
const { parse: resolvingParse, field: resolvedField } = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });
const variant3 = await resolvingParse(html);
output(variant3);

// - 4 ----------------------------------------
// Complete parser, canvas field will provide valid output
// Best for a complete conversion of existing content
//   - implementation providing a connected client to resolve content and a field configuration to tailor the canvas output
//   - requires the user to resolve the content type field (or type the JSON) themselves
const field: CanvasField = {
    id: 'canvasFieldId',
    validations: {
        allowedTypes: {
            types: [{ type: '_paragraph' }]
        }
    }
};
const resolvingParser = await createHtmlParser({ client, field });
const variant4 = await resolvingParser.parse(html);
output(variant4);

// - 5 ----------------------------------------
// Canvas output will be tailored to the destination field but no existing content can be resolved
// Best for offline use to generate consistent output valid for a given field specification
const nonResolvingParser = await createHtmlParser({ field });
const variant5 = await nonResolvingParser.parse(html);
output(variant5);

// - 6 ----------------------------------------
// Brucie bonus, directly calling the base parse function
// Best for those who require the ultimate control in how the existing content is resolved and canvas is generated
//   - e.g. overriding specific parser settings or adding custom resolver methods
const { parserSettings, resolver, settings } = await createHtmlParser({});

// Create a class implementing DataResolver, it needs to implement three methods for locating external resources
class CustomResolver implements DataResolver {
    constructor(public client: Client) {
        // Add what you need for when an external reference is found
        // and your method is called in the constructor here e.g. API client
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

const customResolver = new CustomResolver(client);

const variant6 = await parse('<h1><em><a href="https://www.bbc.co.uk">test</a></em></h1>', settings, parserSettings, resolver);
output(variant6);
