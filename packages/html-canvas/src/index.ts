import { CanvasField, DataResolver, ParserSettings, createCanvasSettings } from '@contensis/html-parser';
import { HtmlParserElements, ParseConfiguration, ParseHtmlConfiguration } from './models';
import { parse } from './parse';
import { DefaultCanvasContentResolver, ResolverStub } from './resolver';

/** Creates a connected parser returning a parse function that can be used multiple times */
export const createHtmlParser = async (opts: ParseConfiguration = {}): Promise<HtmlParserElements> => {
    const { client } = opts;
    if (client) {
        // prepare a resolver from a given client
        const resolver = new DefaultCanvasContentResolver(client);

        // find and set the canvas field
        let field: CanvasField | undefined;

        if ('field' in opts) {
            field = opts.field;
        }

        if ('fieldId' in opts) {
            // Get the content type and find the field with the given id
            const contentType = await client.contentTypes.get(opts.contentTypeId);
            field = contentType.fields?.find((f) => f.id.toLowerCase() === opts.fieldId.toLowerCase().trim()) as CanvasField | undefined;
        }

        if (!field) throw new Error(`Did not resolve a canvas field`);

        // create settings from the field configuration
        const settings = createCanvasSettings(field);

        // convert supplied client into parserSettings
        const project = await client.project.get();
        const parserSettings: ParserSettings = {
            components: [],
            project,
            projectUuid: (project as any).uuid,
            rootUrl: client.clientConfig.rootUrl
        };
        return {
            field,
            parse: (html: string) => parse(html, settings, parserSettings, resolver),
            parserSettings,
            resolver,
            settings
        };
    }

    // No client is supplied, use a stub resolver that does nothing
    const resolver = new ResolverStub();

    const defaultFieldConfig: CanvasField = {
        id: 'any',
        validations: {
            allowedTypes: {
                types: [{ type: '*' }]
            }
        }
    };

    // If no field supplied, use a default configuration
    const field = 'field' in opts && opts.field ? opts.field : defaultFieldConfig;

    const settings = createCanvasSettings(field);

    // No client available, add ParserSettings filler
    const parserSettings: ParserSettings = {
        components: [],
        project: {
            id: 'any',
            primaryLanguage: 'en-GB',
            supportedLanguages: ['en-GB']
        },
        projectUuid: '',
        rootUrl: ''
    };
    return {
        field,
        parse: (html: string) => parse(html, settings, parserSettings, resolver),
        parserSettings,
        resolver,
        settings
    };
};

/** Single use function that creates a parser with supplied config and parses the supplied html */
export const parseHtml = async (htmlOrConfig: string | ParseHtmlConfiguration) => {
    // Has just html arg
    if (typeof htmlOrConfig === 'string') {
        const { parse } = await createHtmlParser({});
        return parse(htmlOrConfig);
    }

    // Has additional config
    const { html, ...config } = htmlOrConfig;
    const { parse } = await createHtmlParser(config);
    return parse(html);
};

/** Re-export shared functions and types useful for consumers */
export { parse };
export type { CanvasField, DataResolver };
export type * from '@contensis/canvas-types';
export type * from './models';
