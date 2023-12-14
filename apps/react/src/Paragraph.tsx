import {
    Paragraph,
    ParagraphBlock,
    RenderBlockProps
} from '@contensis/canvas-react';

export default function (props: RenderBlockProps<ParagraphBlock>) {
    const cssClass = props.block?.properties?.paragraphType ? 'lead' : null;
    return (<Paragraph {...props} className={cssClass} />);
}