import './style.css';
import { getEntry } from './canvas-data';
import { createWriter as createHtmlWriter } from '@contensis/canvas-html';
import { createWriter as createDomWriter } from '@contensis/canvas-html-dom';
import { createWriter as createMdWriter } from '@contensis/canvas-markdown';
import { createWriter as createTextWriter } from '@contensis/canvas-text';
import { myHtmlHeading, myHtmlParagraph, myHtmlFragment, myHtmlTable, myHtmlPanel, myHtmlImage, myHtmlCode, myHtmlList, myHtmlListItem, myHtmlAuthorComponent, myHtmlBookComponent } from './elements-html';
import { myDomHeading, myDomParagraph, myDomFragment, myDomTable, myDomPanel, myDomImage, myDomCode, myDomList, myDomListItem, myDomAuthorComponent, myDomBookComponent } from './elements-dom';
import { myMdParagraph, myMdFragment, myMdAuthorComponent, myMdBookComponent } from './elements-md';

const entry = getEntry();

const htmlWriter = createHtmlWriter({
    items: {
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

const html = htmlWriter({ data: entry.content });
document.getElementById('htmlApp')!.innerHTML = html;

const domWriter = createDomWriter({
    items: {
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

const dom = domWriter({ data: entry.content });
document.getElementById('domApp')?.appendChild(dom as Node);


const mdWriter = createMdWriter({
    items: {
        _fragment: myMdFragment,
        _paragraph: myMdParagraph
    },
    components: {
        author: myMdAuthorComponent,
        book: myMdBookComponent
    }
});

const md = mdWriter({ data: entry.content });

document.getElementById('markdownApp')!.innerHTML = md;

const textWriter = createTextWriter();
const text = textWriter({ data: entry.content });
document.getElementById('textApp')!.innerHTML = text;
