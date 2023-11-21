import { paragraph, fragment, text } from '@contensis/canvas-markdown';

export function myMdParagraph(props: any) {
    if (props.block?.properties?.paragraphType === 'lead') {
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
        `##### ${text(props.block?.value?.name)}`,
        text(props.block?.value?.name),
        `![](${text(props.block?.value?.cover)})`,
        ''
    ].join('\n\n')
}

export function myMdAuthorComponent(props: any) {
    return [
        `![](${text(props.block?.value?.cover)})`,
        `##### ${text(props.block?.value?.name)}`,
        text(props.block?.value?.name),
        ''
    ].join('\n\n');
}
