import 'dotenv/config'; // Loads process.env variables from .env file in project
import { createHtmlParser, Block } from '@contensis/html-canvas';
import { Client, ZenqlQuery } from 'contensis-delivery-api';

const clientId = process.env.clientId as string;
const clientSecret = process.env.sharedSecret as string;
const projectId = process.env.projectId as string;
const rootUrl = process.env.rootUrl as string;

// Connect a Delivery API client
const client = Client.create({
    clientDetails: { clientId, clientSecret },
    clientType: 'client_credentials',
    projectId,
    rootUrl,
    versionStatus: 'latest'
});

// Create a HTML parser targeting the content type and field with the right Canvas configuration
const { parse } = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });

// Get some entries containing richText field
const query = new ZenqlQuery(`sys.contentTypeId = document AND richText EXISTS`);
query.pageSize = 10;
const entries = await client.entries.search(query);

const canvasData: { [id: string]: Block[] } = {};

for (const entry of entries.items) {
    if (entry.richText) {
        // parse the richText content and convert to Canvas
        const canvas = await parse(entry.richText);

        // keep a note of the updated entries
        canvasData[entry.sys.id] = canvas;
    }
}

for (const [entryId, canvas] of Object.entries(canvasData)) {
    // Log canvas data to console
    console.log(`Entry: ${entryId}, Canvas: \n${JSON.stringify(canvas, null, 2)}`);
}
