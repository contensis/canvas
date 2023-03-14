import { Paragraph, Fragment, Text } from '@contensis-canvas/markdown';

export function MyMdParagraph(props: any) {
    if (props.item?.properties?.paragraphType === 'lede') {
        props.context.inLede = true;
    }
    return Paragraph(props);
}

export function MyMdFragment(props: any) {
    return (props.context.inLede)
        ? Fragment.Children(props)
        : Fragment(props);
}

export function MyMdBookComponent(props: any) {
    return [
        `##### ${Text(props.item?.value?.name)}`,
        Text(props.item?.value?.name),
        `![](${Text(props.item?.value?.cover)})`,
        ''
    ].join('\n\n')
}

export function MyMdAuthorComponent(props: any) {
    return [
        `![](${Text(props.item?.value?.cover)})`,
        `##### ${Text(props.item?.value?.name)}`,
        Text(props.item?.value?.name),
        ''
    ].join('\n\n');
}
