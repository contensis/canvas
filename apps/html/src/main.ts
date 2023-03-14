import './style.css';
import { createWriter as createHtmlWriter } from '@contensis-canvas/html';
import { createWriter as createDomWriter } from '@contensis-canvas/html-dom';
import * as CanvasData from './canvas-data';
import { MyHtmlHeading, MyHtmlParagraph, MyHtmlFragment, MyHtmlTable, MyHtmlPanel, MyHtmlImage, MyHtmlCode, MyHtmlList, MyHtmlListItem, MyHtmlAuthorComponent, MyHtmlBookComponent } from './elements-html';
import { MyDomHeading, MyDomParagraph, MyDomFragment, MyDomTable, MyDomPanel, MyDomImage, MyDomCode, MyDomList, MyDomListItem, MyDomAuthorComponent, MyDomBookComponent } from './elements-dom';


const htmlWriter = createHtmlWriter({
    items: {
        _code: MyHtmlCode,
        _fragment: MyHtmlFragment,
        _heading: MyHtmlHeading,
        _image: MyHtmlImage,
        _list: MyHtmlList,
        _listItem: MyHtmlListItem,
        _panel: MyHtmlPanel,
        _paragraph: MyHtmlParagraph,
        _table: MyHtmlTable
    },
    components: {
        book: MyHtmlAuthorComponent, 
        author: MyHtmlBookComponent
    }
});

const html = htmlWriter({ data: CanvasData.data });
document.getElementById('htmlApp')!.innerHTML = html;

const domWriter = createDomWriter({
    items: {
        _code: MyDomCode,
        _fragment: MyDomFragment,
        _heading: MyDomHeading,
        _image: MyDomImage,
        _list: MyDomList,
        _listItem: MyDomListItem,
        _panel: MyDomPanel,
        _paragraph: MyDomParagraph,
        _table: MyDomTable
    },
    components: {
        book: MyDomAuthorComponent, 
        author: MyDomBookComponent
    }
});

const dom = domWriter({ data: CanvasData.data });
document.getElementById('domApp')?.appendChild(dom);

