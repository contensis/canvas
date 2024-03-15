import 'dotenv/config';
import { parseHtml, CanvasField } from '@contensis/html-canvas';
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

const client = new Client({
    clientDetails: { clientId: process.env.clientId as string, clientSecret: process.env.sharedSecret as string },
    clientType: 'client_credentials',
    projectId: process.env.projectId,
    rootUrl: process.env.rootUrl,
    versionStatus: 'latest'
});

// Complete parser, canvas field will be located in the given contentTypeId to tailor the canvas output
// Best for a complete conversion of existing content
//   - simple implementation providing a connected client to resolve field configuration and existing content
//   - this is the one we will use with the CLI
const variant2 = await parseHtml({ client, contentTypeId: 'document', fieldId: 'canvas', html });
output(variant2);

// - 3 ----------------------------------------

// Complete parser, canvas field will provide valid output
// Best for a complete conversion of existing content
//   - implementation providing a connected client to resolve content and a field configuration to tailor the canvas output
const field: CanvasField = {
    id: 'canvasFieldId',
    validations: {
        allowedTypes: {
            types: [{ type: '_paragraph' }]
        }
    }
};
const variant3 = await parseHtml({ client, field, html });
output(variant3);

// - 4 ----------------------------------------

// Canvas output will be tailored to the destination field but no existing content can be resolved
// Best for offline use to generate consistent output valid for a given field specification
const variant4 = await parseHtml({ field, html });
output(variant4);

// ----------------------------------------
