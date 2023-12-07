import { Block, RenderContextProvider, Renderer } from '@contensis/canvas-react';
import { StrongAl } from './canvas-decorators';
import { MyCode, MyFragment, MyHeading, MyImage, MyList, MyListItem, MyPanel, MyParagraph, MyTable } from './canvas-blocks';
import { Al, MyAuthorComponent, MyBookComponent } from './canvas-components';

export function ExtendedRenderer({ data }: { data: Block[] }) {
    return (
        <RenderContextProvider
            blocks={{
                _code: MyCode,
                _fragment: MyFragment,
                _heading: MyHeading,
                _image: MyImage,
                _list: MyList,
                _listItem: MyListItem,
                _panel: MyPanel,
                _paragraph: MyParagraph,
                _table: MyTable
            }}
            components={{
                author: MyAuthorComponent,
                book: MyBookComponent,
                alTest: Al
            }}
            decorators={{
                strong: StrongAl
            }}
        >
            <Renderer data={data} />
        </RenderContextProvider>
    );
}
