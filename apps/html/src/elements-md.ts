import { paragraph, fragment, text } from '@contensis/canvas-markdown';

export function myMdParagraph(props: any) {
    if (props.item?.properties?.paragraphType === 'lead') {
        props.context.inLead = true;
    }
    return paragraph(props);
}

export function myMdFragment(props: any) {
    return (props.context.inLead)
        ? fragment.children(props)
        : fragment(props);
}

export function myMdBookComponent(props: any) {
    return [
        `##### ${text(props.item?.value?.name)}`,
        text(props.item?.value?.name),
        `![](${text(props.item?.value?.cover)})`,
        ''
    ].join('\n\n')
}

export function myMdAuthorComponent(props: any) {
    return [
        `![](${text(props.item?.value?.cover)})`,
        `##### ${text(props.item?.value?.name)}`,
        text(props.item?.value?.name),
        ''
    ].join('\n\n');
}
