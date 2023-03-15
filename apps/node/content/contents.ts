import { createWriter } from '@contensis/canvas-html';
import { MyHeading, MyParagraph, MyFragment, MyTable, MyPanel, MyImage, MyCode, MyList, MyListItem, MyAuthorComponent, MyBookComponent } from './elements';
import { ComposedItem } from '@contensis/canvas-types';

const writer = createWriter({
    items: {
        _code: MyCode,
        _fragment: MyFragment,
        _heading: MyHeading,
        _image: MyImage,
        _list: MyList,
        _listItem: MyListItem,
        _panel: MyPanel,
        _paragraph: MyParagraph,
        _table: MyTable
    },
    components: {
        book: MyAuthorComponent,
        author: MyBookComponent
    }
});

export function getHtml(data: ComposedItem[]) {
    return writer({ data });
}
