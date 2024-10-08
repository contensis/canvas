import { Asset, DataResolver, Entry } from '@contensis/html-parser';
import { Client, ZenqlQuery } from 'contensis-delivery-api';

export class DefaultCanvasContentResolver implements DataResolver {
    constructor(public client: Client) {}
    async getAssetByPath(href: string) {
        return fetchResource(href, async (path: string) => {
            // href is "/image-library/pexels-gronemo-1560102.jpg?w=874&h=951&q=50&format=webp"
            // path is "/image-library/pexels-gronemo-1560102.jpg"
            // sys.uri is "/image-library/pexels-gronemo-1560102.x6548b903.jpg"
            // sys.id is "0c64ce96-a40e-4a8e-9270-a482dc5f87fb"
            const parts = path.split('/');
            let filenameOrId = '';
            let filePath = '';
            if (parts[0]) filenameOrId = parts[0];
            else {
                filenameOrId = parts.pop() || '';
                filePath = `${parts.join('/')}/`;
            }
            let fileZql = '';
            // Search by filePath "/image-library/" and filename "pexels-gronemo-1560102.jpg"
            // Resolve by sys.id for path "/api/image/0c64ce96-a40e-4a8e-9270-a482dc5f87fb"
            if (filenameOrId && filePath)
                fileZql = ` or (sys.properties.filePath="${filePath}" and sys.properties.filename="${filenameOrId}") or sys.id="${filenameOrId}"`;
            // href/path is "pexels-gronemo-1560102.jpg" or "0c64ce96-a40e-4a8e-9270-a482dc5f87fb"
            // Resolve just by filename or sys.id
            if (filenameOrId && !filePath) fileZql = ` or (sys.properties.filename="${filenameOrId}" or sys.id="${filenameOrId}")`;
            const query = new ZenqlQuery(`sys.dataFormat=asset and (sys.uri="${path}"${fileZql}) and sys.versionStatus=latest`);
            query.pageSize = 1;
            const entries = await this.client.entries.search(query);
            if (entries.items.length) {
                const asset = entries.items[0] as Asset;
                // Return the first found asset
                return asset;
            }
            return null;
        });
    }
    async getEntryByPath(href: string) {
        return fetchResource(href, async (path: string) => {
            const node = await this.client.nodes.get({ path, entryFields: ['*'] });
            const entry = node.entry;
            if (typeof entry !== 'undefined') return entry as Entry;
            return null;
        });
    }

    async getNodeByPath(href: string) {
        return fetchResource(href, async (path: string) => {
            return this.client.nodes.get({ path });
        });
    }
}

const rejectPaths = (path: string) => {
    // the api does not want paths like "mailto:...", "https://..."
    return path.includes(':');
};

/**
 * Validate the href, parse the path and handle 404s from api call
 * @param href raw href string
 * @param fn async function to fetch a resource
 * @returns awaited fn call
 */
const fetchResource = async <T extends (path: string) => ReturnType<T>>(href: string, fn: T) => {
    try {
        if (rejectPaths(href)) return null;
        // Parse the path element from a uri or href
        // for example /about?dept=sales#contact returns /about
        const path = href?.split('?')?.[0];
        if (path) return await fn(path); // await is required for the catch block to be hit
    } catch (err: any) {
        if (!('status' in err && err.status == 404)) throw err;
    }
    return null;
};

// Stub Resolver for offline usage (without a delivery client)
export class ResolverStub implements DataResolver {
    getAssetByPath() {
        return Promise.resolve(null);
    }
    getEntryByPath() {
        return Promise.resolve(null);
    }
    getNodeByPath(path: string) {
        return Promise.resolve(null);
    }
}
