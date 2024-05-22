import { Block, CanvasField, CanvasSettings, DataResolver, ParserSettings } from '@contensis/html-parser';
import { Client } from 'contensis-delivery-api';

export type ParseConfiguration = (
    | {
          /** Provide a Delivery API client that is connected to your Contensis instance so any existing content can be searched for and correctly linked if found */
          client?: Client;
          /** Supply the destination Canvas field JSON so the content generated can be tailored to fit your field configuration */
          field?: CanvasField;
      }
    | CanvasFieldLookupOptions
) & {
    /** Add your site's public root uri (used to prefix relative links in your content that we cannot resolve in the project site view) */
    rootUri?: string;
};

export type ParseHtmlConfiguration = { html: string } & ParseConfiguration;

export type CanvasFieldLookupOptions = {
    /** Provide a Delivery API client that is connected to your Contensis instance so any existing content can be searched for and correctly linked if found */
    client: Client;
    /** Provide the id of the content type containing the destination Canvas field id so the content generated can be tailored to fit your field configuration */
    contentTypeId: string;
    /** Supply the destination Canvas field id so the content generated can be tailored to fit your field configuration */
    fieldId: string;
};

export type HtmlParserElements = {
    field: CanvasField;
    parse: HtmlCanvasParser;
    parserSettings: ParserSettings;
    resolver: DataResolver;
    settings: CanvasSettings;
};

export type HtmlCanvasParser = (html: string) => Promise<Block[]>;
