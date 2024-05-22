import { expect } from 'chai';
import { CanvasField, createHtmlParser } from '@contensis/html-canvas';
import { Block, HeadingBlock, LinkBlock, ParagraphBlock } from '@contensis/canvas-types';
import { Client, Config } from 'contensis-delivery-api';
import { readFileSync } from 'fs';
import { NockMocker, mocks } from './mocking/mocks.mts';
import { getAllBlockTypes, getAllLinkBlocks } from './utils/block-types.mts';

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
          expect(canvas).to.be.an('array');
          expect(canvas).to.have.a.lengthOf.greaterThan(0);
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
          expect(canvas).to.be.an('array');
          expect(canvas).to.have.a.lengthOf.greaterThan(0);
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
    let links: LinkBlock[];
    after(() => mock.done(canvas));
    before(async () => {
      mock = mocks(`createHtmlParser_webpage_content`);
      const pageHtml = readFileSync('./test/examples/html-example.htm', { encoding: 'utf8' });
      const client = new Client(clientConfig);
      const parser = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas', rootUri: 'https://mysite.com' });
      canvas = await parser.parse(pageHtml);
      links = getAllLinkBlocks(canvas);
    });
    describe(`Given I wish to convert part of my site to Canvas, when the HTML is parsed`, () => {
      describe(`Then I expect the Canvas to accurately represent my HTML content`, () => {
        it(` returns canvas content blocks`, () => {
          expect(canvas).to.be.an('array');
          expect(canvas).to.have.a.lengthOf.greaterThan(0);
        });
        it(` has multiple blocks of type "_heading", "_paragraph", "_list"`, () => {
          const blockTypes = getAllBlockTypes(canvas);
          expect(blockTypes).to.include('_heading');
          expect(blockTypes).to.include('_paragraph');
          expect(blockTypes).to.include('_list');
          expect(blockTypes).to.include('_link');

          expect(blockTypes.filter((t) => t === '_heading')).to.have.lengthOf(5);
          expect(blockTypes.filter((t) => t === '_paragraph')).to.have.lengthOf(5);
          expect(blockTypes.filter((t) => t === '_list')).to.have.lengthOf(7);
          expect(blockTypes.filter((t) => t === '_link')).to.have.lengthOf(7);
        });
        it(` with a first value of "Entry requirements"`, () => {
          expect(canvas[0].value).to.equal('Entry requirements');
        });
      });
    });
    describe(`Given my HTML content contains links to other content`, () => {
      describe(`Then I expect the Canvas to contain all of my links`, () => {
        it(` which were provided as absolute urls`, () => {
          const absolute = links.filter((l) => l.properties?.link?.sys?.uri?.startsWith('https://www.ludlow.ac.uk'));
          expect(absolute).to.have.a.lengthOf(3);
        });
        // it(` which have been resolved in site view`, () => {
        //   console.log(JSON.stringify(canvas));
        // });
        it(` which were provided as relative links and are not resolved in site view`, () => {
          const relative = links.filter((l) => l.properties?.link?.sys?.uri?.startsWith('https://mysite.com'));
          expect(relative).to.have.a.lengthOf(3);
        });

        it(` which are mailto: links`, () => {
          const mailto = links.filter((l) => l.properties?.link?.sys?.uri?.startsWith('mailto:'));
          expect(mailto).to.have.a.lengthOf(1);
        });
      });
    });
  });

  describe(`Scenario: Parse content with an image`, () => {
    let canvas: Block[];
    let firstBlock: Block;
    after(() => mock.done(canvas));
    before(async () => {
      mock = mocks(`createHtmlParser_image_content`);
      const pageHtml = readFileSync('./test/examples/image-example.htm', { encoding: 'utf8' });
      const client = new Client(clientConfig);
      const parser = await createHtmlParser({ client, contentTypeId: 'document', fieldId: 'canvas' });
      canvas = await parser.parse(pageHtml);
      firstBlock = canvas[0];
    });
    describe(`Given I wish to convert part of my site to Canvas, when the HTML is parsed`, () => {
      describe(`Then I expect the Canvas to locate my existing images`, () => {
        it(` returns canvas content blocks`, () => {
          expect(canvas).to.be.an('array');
          expect(canvas).to.have.a.lengthOf.greaterThan(0);
        });
        it(` has a block of type "_image"`, () => {
          expect(firstBlock.type).to.equal('_image');
        });

        it(` the image has a uri`, () => {
          expect(firstBlock.value).is.an('object');
          expect(firstBlock.value.asset).is.an('object');
          expect(firstBlock.value.asset.sys.uri).is.a('string');
          expect(firstBlock.value.asset.sys.uri).has.a.lengthOf.greaterThan(1);
        });
      });
    });
  });
});
