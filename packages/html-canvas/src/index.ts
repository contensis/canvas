import { CanvasField, DataResolver, ParserSettings, createCanvasSettings } from '@contensis/html-parser';
import { HtmlParserElements, ParseConfiguration, ParseHtmlConfiguration } from './models';
import { parse } from './parse';
import { DefaultCanvasContentResolver, ResolverStub } from './resolver';

/** Creates a connected parser returning a parse function that can be used multiple times */
export const createHtmlParser = async (opts: ParseConfiguration = {}): Promise<HtmlParserElements> => {
    const { client, rootUri = '' } = opts;
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

        // Create settings from the field configuration
        const settings = createCanvasSettings(field);

        // Convert supplied client into parserSettings
        const project = await client.project.get();

        // Get list of allowed component ids from the field validations so component data can be validated
        const components = field.validations?.allowedTypes?.types.find((t) => t.type === '_component')?.components?.allowed || [];
        const assetContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_asset')?.assetContentTypes?.allowed || [];
        const entryContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_entry')?.entryContentTypes?.allowed || [];
        const formContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_formContentType')?.formContentTypes?.allowed || [];

        // Handle the '*' allowed type to allow any component to be parsed (which may not exist in the target project)
        if (field.validations?.allowedTypes?.types.find((t) => t.type === '*')) components.push('*');

        const parserSettings: ParserSettings = {
            components,
            assetContentTypes,
            entryContentTypes,
            formContentTypes,
            project,
            projectUuid: (project as any).uuid,
            rootUrl: rootUri
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

    // Get list of allowed component ids from the field validations
    const components = field.validations?.allowedTypes?.types.find((t) => t.type === '_component')?.components?.allowed || [];
    const assetContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_asset')?.assetContentTypes?.allowed || [];
    const entryContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_entry')?.entryContentTypes?.allowed || [];
    const formContentTypes = field.validations?.allowedTypes?.types.find((t) => t.type === '_formContentType')?.formContentTypes?.allowed || [];

    // Handle the '*' allowed type to allow any component to be parsed (which may not exist in the target project)
    if (field.validations?.allowedTypes?.types.find((t) => t.type === '*')) components.push('*');

    // No client available, add ParserSettings filler
    const parserSettings: ParserSettings = {
        components,
        assetContentTypes,
        entryContentTypes,
        formContentTypes,
        project: {
            id: 'any',
            primaryLanguage: 'en-GB',
            supportedLanguages: ['en-GB']
        },
        projectUuid: '',
        rootUrl: rootUri,
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
