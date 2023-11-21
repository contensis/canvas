import { createRenderer } from '@contensis/canvas-html';
import { Block } from '@contensis/canvas-types';
import { MyHeading, MyTable, MyPanel, MyImage, MyCode } from './elements';

const renderer = createRenderer({
    blocks: {
        _code: MyCode,
        _heading: MyHeading,
        _image: MyImage,
        _panel: MyPanel,
        _table: MyTable
    }
});

export function getHtml(data: Block[]) {
    return renderer({ data });
}