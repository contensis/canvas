import { BLOCK_TAGS, IGNORE_TAGS } from '../../models';
import { BlockElement } from './block-element';
import {
    AbbreviationElement,
    DelElement,
    EmElement,
    InsElement,
    KbdElement,
    MarkElement,
    SElement,
    StrongElement,
    SubElement,
    SupElement,
    UElement,
    VarElement
} from './decorators';
import { IgnoreElement } from './ignore-element';
import { InlineElement } from './inline-element';
import { Attributes, Element, Resolver } from './models';
import { RootElement } from './root-element';
import { Context } from './context';
import {
    AElement,
    AsideElement,
    BlockquoteElement,
    BrElement,
    CaptionElement,
    CiteElement,
    CodeElement,
    DivElement,
    FigCaptionElement,
    FigureElement,
    FooterElement,
    HeadingElement,
    HrElement,
    ImgElement,
    LiElement,
    ListElement,
    PElement,
    PreElement,
    TableElement,
    TbodyElement,
    TdElement,
    TfootElement,
    TheadElement,
    ThElement,
    TrElement
} from './elements';
import { AResolver, ImgResolver, NullResolver } from './resolvers';
import { ResolveContext } from './resolve-context';

type ElementConstructor<T extends Element = Element> = new (name: string, attributes: Attributes, content: Context) => T;

const BLOCK_NODES: Record<string, ElementConstructor> = Object.keys(BLOCK_TAGS).reduce(
    (prev, tag) => ({ ...prev, [tag.toLowerCase()]: BlockElement }),
    {} as Record<string, ElementConstructor>
);

const IGNORE_NODES: Record<string, ElementConstructor> = Object.keys(IGNORE_TAGS).reduce(
    (prev, tag) => ({ ...prev, [tag.toLowerCase()]: IgnoreElement }),
    {} as Record<string, ElementConstructor>
);

const ELEMENT_NODES: Record<string, ElementConstructor> = {
    ...BLOCK_NODES,
    ...IGNORE_NODES,
    body: RootElement,
    a: AElement,
    abbr: AbbreviationElement,
    aside: AsideElement,
    blockquote: BlockquoteElement,
    br: BrElement,
    caption: CaptionElement,
    cite: CiteElement,
    code: CodeElement,
    del: DelElement,
    div: DivElement,
    em: EmElement,
    figcaption: FigCaptionElement,
    figure: FigureElement,
    footer: FooterElement,
    h1: HeadingElement,
    h2: HeadingElement,
    h3: HeadingElement,
    h4: HeadingElement,
    h5: HeadingElement,
    h6: HeadingElement,
    hr: HrElement,
    img: ImgElement,
    ins: InsElement,
    kbd: KbdElement,
    li: LiElement,
    mark: MarkElement,
    ol: ListElement,
    p: PElement,
    pre: PreElement,
    s: SElement,
    strong: StrongElement,
    sub: SubElement,
    sup: SupElement,
    table: TableElement,
    tbody: TbodyElement,
    td: TdElement,
    tfoot: TfootElement,
    th: ThElement,
    thead: TheadElement,
    tr: TrElement,
    u: UElement,
    ul: ListElement,
    var: VarElement
};

export function findElement(name: string): ElementConstructor {
    return ELEMENT_NODES[name] || InlineElement;
}

type ResolverConstructor<T extends Resolver = Resolver> = new (name: string, attributes: Attributes, context: ResolveContext) => T;

const ELEMENT_RESOLVERS: Record<string, ResolverConstructor> = {
    a: AResolver,
    img: ImgResolver
};

export function findResolver(name: string): ResolverConstructor {
    return ELEMENT_RESOLVERS[name] || NullResolver;
}
