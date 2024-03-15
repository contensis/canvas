import { expect } from 'chai';
import { CanvasField, createHtmlParser } from '@contensis/html-canvas';
import { Block, HeadingBlock, ParagraphBlock } from '@contensis/canvas-types';
import { Client, Config } from 'contensis-delivery-api';
import { readFileSync } from 'fs';
import { NockMocker, mocks } from './mocking/mocks.mts';

let mock: NockMocker;

const html = '<h1>test</h1>';

const clientConfig: Config = NockMocker.maskConfig({
  clientDetails: { clientId: process.env.clientId as string, clientSecret: process.env.sharedSecret as string },
  clientType: 'client_credentials',
  projectId: process.env.projectId,
  rootUrl: process.env.rootUrl,
  versionStatus: 'latest'
});

describe('createHtmlParser function tests', () => {
  describe(`Scenario: Parse simple html fragment ${html}`, () => {
    let canvas: Block[];
    let block: HeadingBlock;
    before(async () => {
      const parser = await createHtmlParser();
      canvas = await parser.parse(html);
      block = canvas[0] as HeadingBlock;
    });
    describe(`Given I wish to quickly test something with the parser, when the HTML is parsed`, () => {
      describe(`Then I expect it returns JSON output that is a Canvas representation of this HTML fragment in Canvas`, () => {
        it(` returns canvas content blocks`, () => {
          expect(typeof canvas === 'object' && Array.isArray(canvas)).to.be.true;
          expect(canvas.length).to.be.greaterThan(0);
        });
        it(` has a block of type "_heading"`, () => {
          expect(block.type).to.equal('_heading');
        });
        it(` with level 1 in properties`, () => {
          expect(block.properties?.level).to.equal(1);
        });
        it(` with a value of "test"`, () => {
          expect(block.value).to.equal('test');
        });
      });
    });
  });

  describe(`Scenario: Parse simple HTML with a specific field configuration`, () => {
    let block: ParagraphBlock;
    before(async () => {
      const field: CanvasField = {
        id: 'canvasFieldId',
        validations: {
          allowedTypes: {
            types: [{ type: '_paragraph' }]
          }
        }
      };
      const parser = await createHtmlParser({ field });
      const canvas = await parser.parse(html);
      block = canvas[0] as ParagraphBlock;
    });
    describe(`Given I wish to use a specific field configuration, when the HTML is parsed`, () => {
      describe(`Then I expect the JSON is prepared with only the content blocks that are specified`, () => {
        it(` has a block of type "_paragraph"`, () => {
          expect(block.type).to.equal('_paragraph');
        });
        it(` with a value of "test"`, () => {
          expect(block.value).to.equal('test');
        });
      });
    });
  });

  describe(`Scenario: Parse with a connected Contensis client resolving a specific field in a content type`, () => {
    let canvas: Block[];
    let block: HeadingBlock;
    after(() => mock.done(canvas));
    before(async () => {
      mock = mocks(`createHtmlParser_client_contentTypeId_fieldId`);
      const client = new Client(clientConfig);
      const parser = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });
      canvas = await parser.parse(html);
      block = canvas[0] as HeadingBlock;
    });
    describe(`Given I wish to target a canvas field in a particular content type, when the HTML is parsed`, () => {
      describe(`Then I expect the JSON is prepared with the content blocks that are allowed in editor configuration`, () => {
        it(` returns canvas content blocks`, () => {
          expect(typeof canvas === 'object' && Array.isArray(canvas)).to.be.true;
          expect(canvas.length).to.be.greaterThan(0);
        });
        it(` has a block of type "_heading"`, () => {
          expect(block.type).to.equal('_heading');
        });
        it(` with level 1 in properties`, () => {
          expect(block.properties?.level).to.equal(1);
        });
        it(` with a value of "test"`, () => {
          expect(block.value).to.equal('test');
        });
      });
    });
  });

  describe(`Scenario: Parse realistic web page content`, () => {
    let canvas: Block[];
    after(() => mock.done(canvas));
    before(async () => {
      mock = mocks(`createHtmlParser_webpage_content`);
      const pageHtml = readFileSync('./test/examples/html-example.htm', { encoding: 'utf8' });
      const client = new Client(clientConfig);
      const parser = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });
      canvas = await parser.parse(pageHtml);
    });
    describe(`Given I wish to convert part of my site to Canvas, when the HTML is parsed`, () => {
      describe(`Then I expect the Canvas to accurately represent my HTML content`, () => {
        it(` returns canvas content blocks`, () => {
          expect(typeof canvas === 'object' && Array.isArray(canvas)).to.be.true;
          expect(canvas.length).to.be.greaterThan(0);
        });
        it(` has multiple blocks of type "_heading", "_paragraph", "_list"`, () => {
          const types = canvas.map((b) => b.type);
          expect(types).to.include('_heading');
          expect(types.filter((t) => t === '_heading')).length.is.greaterThan(1);
          expect(types).to.include('_paragraph');
          expect(types.filter((t) => t === '_paragraph')).length.is.greaterThan(1);
          expect(types).to.include('_list');
          expect(types.filter((t) => t === '_list')).length.is.greaterThan(1);
        });
        it(` with a first value of "Entry requirements"`, () => {
          expect(canvas[0].value).to.equal('Entry requirements');
        });
      });
    });
  });

  describe(`Scenario: Parse content with an image`, () => {
    let canvas: Block[];
    after(() => mock.done(canvas));
    before(async () => {
      mock = mocks(`createHtmlParser_image_content`);
      const pageHtml = readFileSync('./test/examples/image-example.htm', { encoding: 'utf8' });
      const client = new Client(clientConfig);
      const parser = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });
      canvas = await parser.parse(pageHtml);
    });
    describe(`Given I wish to convert part of my site to Canvas, when the HTML is parsed`, () => {
      describe(`Then I expect the Canvas to locate my existing images`, () => {
        it(` returns canvas content blocks`, () => {
          expect(typeof canvas === 'object' && Array.isArray(canvas)).to.be.true;
          expect(canvas.length).to.be.greaterThan(0);
        });
        it(` has a block of type "_image"`, () => {
          expect(canvas[0].type).to.equal('_image');
        });

        it(` the image has a uri`, () => {
          expect(typeof canvas[0].value).to.equal('object');
          expect(typeof canvas[0].value.asset).to.equal('object');
          expect(typeof canvas[0].value.asset.sys.uri).to.equal('string');
          expect(canvas[0].value.asset.sys.uri).length.greaterThan(1);
        });
      });
    });
  });
});
