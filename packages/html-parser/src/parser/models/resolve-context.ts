type ResolveType = 'entry' | 'node' | 'asset';
type ResolveData = { type: ResolveType; uri: string };

export class ResolveContext {
    private data = new Map<string, ResolveData>();

    static toKey(type: ResolveType, value: string) {
        return `TYPE: ${type} URL: ${value}`;
    }

    resolve(type: ResolveType, uri: string) {
        if (uri) {
            const key = ResolveContext.toKey(type, uri);
            if (!this.data.has(key)) {
                this.data.set(key, { type, uri });
            }
        }
    }

    export() {
        return this.data;
    }
}
