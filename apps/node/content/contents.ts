import { createWriter } from '@contensis/canvas-html';
import { myHtmlHeading, myHtmlParagraph, myHtmlFragment, myHtmlTable, myHtmlPanel, myHtmlImage, myHtmlCode, myHtmlList, myHtmlListItem, myHtmlAuthorComponent, myHtmlBookComponent } from './elements';
import { ComposedItem } from '@contensis/canvas-types';

const writer = createWriter({
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

export function getHtml(data: ComposedItem[]) {
    return writer({ data });
}
