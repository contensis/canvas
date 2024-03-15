import { CanvasSettings, ParserSettings, CanvasPreParser, CanvasParser, DataResolver } from '@contensis/html-parser';
import { HtmlWalker } from './html-walker';

/** This is the main parse function */
export async function parse(html: string, settings: CanvasSettings, parserSettings: ParserSettings, resolver: DataResolver) {
    const preParser = new CanvasPreParser(
        new HtmlWalker(html),
        settings,
        parserSettings,
        (id) => id,
        (id) => id,
        resolver,
        new UrlParser(parserSettings.rootUrl)
    );
    const dataProvider = await preParser.parse();
    const parser = new CanvasParser(new HtmlWalker(html), dataProvider);
    return parser.parse();
}

class UrlParser {
    constructor(private rootUrl: string) {}

    parseUrl(path: string) {
        let url: URL | undefined;

        try {
            url = new URL(path);
        } catch {}

        if (!url) {
            try {
                url = new URL(this.rootUrl + path);
            } catch {}
        }

        if (url) {
            const { searchParams } = url;
            const queryParams = Array.from(searchParams.keys()).reduce((prev, key) => {
                const param = searchParams.get(key);
                if (param) prev[key] = param;
                return prev;
            }, {} as Record<string, string>);
            return {
                path: url.pathname,
                query: url.search,
                fragment: url.hash,
                queryParams
            };
        }
        return {
            path,
            query: '',
            fragment: '',
            queryParams: {}
        }; // null;
    }

    toAbsoluteUrl(path: string) {
        try {
            new URL(path);
            return path;
        } catch {}
        try {
            new URL(this.rootUrl + path);
            return this.rootUrl + path;
        } catch {}
        return ''; // null;
    }
}
