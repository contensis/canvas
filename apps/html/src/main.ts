import './style.css';
import { getEntry } from './canvas-data';
import { createWriter as createHtmlWriter, Table } from '@contensis/canvas-html';

// function StripedTable(props: any) {
//     return Table({
//         ...props,
//         className: 'table table-striped'
//     });
// }

const entry = getEntry();
const writer = createHtmlWriter({});

const html = writer({ data: entry.content });
document.getElementById('htmlApp')!.innerHTML = html;
































// import { createWriter as createDomWriter } from '@contensis/canvas-html-dom';
// import { createWriter as createMdWriter } from '@contensis/canvas-markdown';
// import * as CanvasData from './canvas-data';
// import { MyHtmlHeading, MyHtmlParagraph, MyHtmlFragment, MyHtmlTable, MyHtmlPanel, MyHtmlImage, MyHtmlCode, MyHtmlList, MyHtmlListItem, MyHtmlAuthorComponent, MyHtmlBookComponent } from './elements-html';
// import { MyDomHeading, MyDomParagraph, MyDomFragment, MyDomTable, MyDomPanel, MyDomImage, MyDomCode, MyDomList, MyDomListItem, MyDomAuthorComponent, MyDomBookComponent } from './elements-dom';
// import { MyMdParagraph, MyMdFragment, MyMdAuthorComponent, MyMdBookComponent } from './elements-md';


// const htmlWriter = createHtmlWriter({
//     items: {
//         _code: MyHtmlCode,
//         _fragment: MyHtmlFragment,
//         _heading: MyHtmlHeading,
//         _image: MyHtmlImage,
//         _list: MyHtmlList,
//         _listItem: MyHtmlListItem,
//         _panel: MyHtmlPanel,
//         _paragraph: MyHtmlParagraph,
//         _table: MyHtmlTable
//     },
//     components: {
//         book: MyHtmlAuthorComponent,
//         author: MyHtmlBookComponent
//     }
// });

// const html = htmlWriter({ data: CanvasData.data });
// document.getElementById('htmlApp')!.innerHTML = html;

// const domWriter = createDomWriter({
//     items: {
//         _code: MyDomCode,
//         _fragment: MyDomFragment,
//         _heading: MyDomHeading,
//         _image: MyDomImage,
//         _list: MyDomList,
//         _listItem: MyDomListItem,
//         _panel: MyDomPanel,
//         _paragraph: MyDomParagraph,
//         _table: MyDomTable
//     },
//     components: {
//         book: MyDomAuthorComponent,
//         author: MyDomBookComponent
//     }
// });

// const dom = domWriter({ data: CanvasData.data });
// document.getElementById('domApp')?.appendChild(dom);


// const mdWriter = createMdWriter({
//     items: {
//         _fragment: MyMdFragment,
//         _paragraph: MyMdParagraph
//     },
//     components: {
//         author: MyMdAuthorComponent,
//         book: MyMdBookComponent
//     }
// });

// const md = mdWriter({ data: CanvasData.data });

// document.getElementById('markdownApp')!.innerHTML = md;
