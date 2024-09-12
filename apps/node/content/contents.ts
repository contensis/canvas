import { createRenderer } from '@contensis/canvas-html';
import { myHtmlHeading, myHtmlParagraph, myHtmlFragment, myHtmlTable, myHtmlPanel, myHtmlImage, myHtmlCode, myHtmlList, myHtmlListItem, myHtmlAuthorComponent, myHtmlBookComponent } from './elements';
import { Block } from '@contensis/canvas-types';
import { divider, heading, table, tableCell, tableHeaderCell } from '@contensis/canvas-html';

const renderer = createRenderer({
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

export function getHtml(data: Block[]) {
    return renderer({ data });
}


const emailRenderer = createRenderer({
    blocks: {
        _divider: function (props: any) {
            return divider({ ...props, style: 'background-color: #dbdbdb; border: 0; height: 1px; margin: 32px 0' });
        },
        _heading: function (props: any) {
            const level = props.block?.properties?.level || 1;
            switch (level) {
                case 1: {
                    return heading({ ...props, style: 'font-size: 18px; line-height: 24px; font-weight: 800; margin-bottom: 16px;' })
                }
                case 2: {
                    return heading({ ...props, style: 'font-size: 16px; line-height: 24px; margin-bottom: 16px' });
                }
                case 3: {
                    return heading({ ...props, style: 'font-size: 14px; line-height: 20px; margin-bottom: 16px' });
                }
                default: {
                    return heading(props);
                }
            }
        },
        _table: function (props: any) {
            return table({ ...props, style: 'margin-top: 8px; margin-bottom: 32px' });
        },
        _tableCell: function (props: any) {
            return tableCell({ ...props, style: 'padding: 8px 0' });
        },
        _tableHeaderCell: function (props: any) {
            return tableHeaderCell({ ...props, style: 'padding: 8px 0' });
        }
    }
});

export function toEmail(data: Block[]) {
    return emailRenderer({ data });
}