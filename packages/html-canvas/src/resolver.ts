import { Asset, DataResolver, Entry } from '@contensis/html-parser';
import { Client, ZenqlQuery } from 'contensis-delivery-api';

export class DefaultCanvasContentResolver implements DataResolver {
    constructor(public client: Client) {}
    async getAssetByPath(path: string) {
        return fetchResource(path, async () => {
            const query = new ZenqlQuery(`sys.dataFormat=asset and sys.uri="${path}" and sys.versionStatus=latest`);
            query.pageSize = 1;
            const entries = await this.client.entries.search(query);
            if (entries.items.length) return entries.items[0] as Asset;
            return null;
        });
    }
    async getEntryByPath(path: string) {
        return fetchResource(path, async () => {
            const node = await this.client.nodes.get({ path, entryFields: ['*'] });
            const entry = node.entry;
            if (typeof entry !== 'undefined') return entry as Entry;
            return null;
        });
    }

    async getNodeByPath(path: string) {
        return fetchResource(path, async () => {
            return this.client.nodes.get({ path });
        });
    }
}

const rejectPaths = (path: string) => {
    // the api does not want paths like "mailto:...", "https://..."
    return path.includes(':');
};

const fetchResource = async <T extends () => ReturnType<T>>(path: string, fn: T) => {
    // Validate the path as not external and handle 404s from api call
    try {
        if (rejectPaths(path)) return null;
        return await fn(); // await is required for the catch block to be hit
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
