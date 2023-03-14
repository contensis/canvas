import { createWriter } from '@contensis-canvas/html';
import { ComposedItem } from '@contensis-canvas/types';
import { MyHeading, MyTable, MyPanel, MyImage, MyCode } from './elements';

const writer = createWriter({
    items: {
        _code: MyCode,
        _heading: MyHeading,
        _image: MyImage,
        _panel: MyPanel,
        _table: MyTable
    }
});

export function getHtml(data: ComposedItem[]) {
    return writer({ data });
}