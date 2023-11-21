import './style.css';
import { getEntry } from './canvas-data';
import { createRenderer as createHtmlRenderer } from '@contensis/canvas-html';
import { createRenderer as createDomRenderer } from '@contensis/canvas-html-dom';
import { createRenderer as createMdRenderer } from '@contensis/canvas-markdown';
import { createRenderer as createTextRenderer } from '@contensis/canvas-text';
import { myHtmlHeading, myHtmlParagraph, myHtmlFragment, myHtmlTable, myHtmlPanel, myHtmlImage, myHtmlCode, myHtmlList, myHtmlListItem, myHtmlAuthorComponent, myHtmlBookComponent } from './elements-html';
import { myDomHeading, myDomParagraph, myDomFragment, myDomTable, myDomPanel, myDomImage, myDomCode, myDomList, myDomListItem, myDomAuthorComponent, myDomBookComponent } from './elements-dom';
import { myMdParagraph, myMdFragment, myMdAuthorComponent, myMdBookComponent } from './elements-md';

const entry = getEntry();

const htmlRenderer = createHtmlRenderer({
    blocks: {
        _code: myHtmlCode,
        _fragment: myHtmlFragment,
        _heading: myHtmlHeading,
        _image: myHtmlImage,
        _list: myHtmlList,
        _listItem: myHtmlListItem,
        _panel: myHtmlPanel,
        _paragraph: myHtmlParagraph,
        _table: myHtmlTable
    },
    components: {
        book: myHtmlAuthorComponent,
        author: myHtmlBookComponent
    }
});

const html = htmlRenderer({ data: entry.content });
document.getElementById('htmlApp')!.innerHTML = html;

const domRenderer = createDomRenderer({
    blocks: {
        _code: myDomCode,
        _fragment: myDomFragment,
        _heading: myDomHeading,
        _image: myDomImage,
        _list: myDomList,
        _listItem: myDomListItem,
        _panel: myDomPanel,
        _paragraph: myDomParagraph,
        _table: myDomTable
    },
    components: {
        book: myDomAuthorComponent,
        author: myDomBookComponent
    }
});

const dom = domRenderer({ data: entry.content });
document.getElementById('domApp')?.appendChild(dom as Node);


const mdRenderer = createMdRenderer({
    blocks: {
        _fragment: myMdFragment,
        _paragraph: myMdParagraph
    },
    components: {
        author: myMdAuthorComponent,
        book: myMdBookComponent
    }
});

const md = mdRenderer({ data: entry.content });

document.getElementById('markdownApp')!.innerHTML = md;

const textRenderer = createTextRenderer();
const text = textRenderer({ data: entry.content });
document.getElementById('textApp')!.innerHTML = text;
