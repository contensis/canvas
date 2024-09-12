import {
    Block,
    FragmentBlock,
    HEADING_TAGS as HEADING_TAGS1,
    InlineBlock,
    LIST_TAGS as LIST_TAGS1,
    ListType,
    ParagraphBlock,
    isInline,
    isList,
    isMergeableFragment,
    isSimpleFragment,
    isVoid,
    isVoidInline
} from '../../models';

export const LIST_TAGS = Object.entries(LIST_TAGS1).reduce(
    (prev, [key, value]) => ({ ...prev, [key.toLowerCase()]: value }),
    {} as Record<'ol' | 'ul', ListType>
);

export const HEADING_TAGS = Object.entries(HEADING_TAGS1).reduce(
    (prev, [key, value]) => ({ ...prev, [key.toLowerCase()]: value }),
    {} as Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', number>
);

function isEquivalentFragment(fragment1: FragmentBlock, fragment2: FragmentBlock) {
    if (fragment1?.properties?.id || fragment2?.properties?.id) {
        return false;
    }
    const decoratorCount1 = fragment1.properties?.decorators?.length || 0;
    const decoratorCount2 = fragment2.properties?.decorators?.length || 0;
    if (decoratorCount1 !== decoratorCount2) {
        return false;
    }
    if (decoratorCount1 === 0) {
        return true;
    }
    const combinedDecorators = [...new Set([...(fragment1.properties?.decorators || []), ...(fragment2.properties?.decorators || [])])];
    return combinedDecorators.length === decoratorCount1;
}

function mergeLists<T extends Block>(blocks: T[]): T[] {
    return blocks.reduce((items, item) => {
        const lastItem = items[items.length - 1];
        let pushCurrentItem = true;
        if (isList(item) && isList(lastItem)) {
            const lastListType = lastItem.properties?.listType || 'unordered';
            const listType = item.properties?.listType || 'unordered';
            if (lastListType === listType && !lastItem.properties?.id && !item?.properties?.id) {
                if (item.value) {
                    lastItem.value = lastItem.value || [];
                lastItem.value.push(...item.value);
                }
                pushCurrentItem = false;
            }
        }
        if (pushCurrentItem) {
            items.push(item);
        }
        return items;
    }, [] as T[]);
}

export function mergeItems<T extends Block>(blocks: T[], newId: () => string): T[] {
    blocks = mergeLists(blocks);

    blocks = blocks.reduce((items, item, index, array) => {
        let pushCurrentItem = true;
        if (isSimpleFragment(item)) {
            if (!item.value?.trim()) {
                const lastItem = items[items.length - 1];
                const nextItem = array[index + 1];
                if (isMergeableFragment(lastItem) && isMergeableFragment(nextItem) && isEquivalentFragment(lastItem, nextItem)) {
                    const mergedFragment = mergeFragments(lastItem, item, newId);
                    items.pop();
                    items.push(mergedFragment as T);
                    pushCurrentItem = false;
                }
            }
        }
        if (pushCurrentItem) {
            items.push(item);
        }
        return items;
    }, [] as T[]);

    return blocks.reduce((items, item) => {
        let pushCurrentItem = true;
        const lastItem = items[items.length - 1];
        if (isMergeableFragment(lastItem) && isMergeableFragment(item) && isEquivalentFragment(lastItem, item)) {
            const mergedFragment = mergeFragments(lastItem, item, newId);
            items.pop();
            items.push(mergedFragment as T);
            pushCurrentItem = false;
        }
        if (pushCurrentItem) {
            items.push(item);
        }
        return items;
    }, [] as T[]);
}

function mergeFragments(fragment1: FragmentBlock, fragment2: FragmentBlock, newId: () => string): FragmentBlock {
    const value1 = fragment1.value || '';
    const value2 = fragment2.value || '';
    if (typeof value1 === 'string' && typeof value2 === 'string') {
        return {
            ...fragment1,
            value: fixWhitespace(`${value1}${value2}`)
        };
    }
    let children: InlineBlock[] = [value1, value2]
        .map((value) => {
            if (typeof value === 'string') {
                return { type: '_fragment' as const, id: newId(), value };
            }
            return value;
        })
        .flat();

    children = mergeItems(children, newId);
    return {
        ...fragment1,
        value: children
    };
}

type BlockBlock = Pick<ParagraphBlock, 'type' | 'id'> & {
    value: InlineBlock[];
};

export function wrapInline(blocks: Block[], createBlock: () => BlockBlock): Block[] {
    let { items } = blocks.reduce(
        (prev, item) => {
            if (isInline(item)) {
                if (!prev.lastBlock) {
                    prev.lastBlock = createBlock();
                    prev.items.push(prev.lastBlock);
                }
                prev.lastBlock.value.push(item);
            } else {
                prev.items.push(item);
                prev.lastBlock = null;
            }
            return prev;
        },
        { items: [], lastBlock: null } as { items: Block[]; lastBlock: null | BlockBlock }
    );
    items = items
        .filter((item) => isVoid(item) || !!item.value)
        .map(
            (item) =>
                ({
                    ...item,
                    value: Array.isArray(item.value) ? toValue(item.value) : item.value
                } as Block)
        );
    return items;
}

function canTrimBlock(block: Block) {
    return !isVoid(block) && !isInline(block);
}

export function trimItems<T extends Block>(blocks: T[], removeEmptyBlocks: boolean, newId: () => string): T[] {
    blocks = blocks.map((item) => {
        if (canTrimBlock(item)) {
            const { value } = item;
            if (typeof value === 'string') {
                item = {
                    ...item,
                    value: value.trim()
                };
            } else if (Array.isArray(value)) {
                let newValue = trimStart(value as Block[]);
                newValue = trimEnd(newValue);
                newValue = mergeItems(newValue, newId);
                const trimmedValue = toValue(newValue);
                item = {
                    ...item,
                    value: trimmedValue
                };
            }
        }
        return item;
    });

    if (removeEmptyBlocks) {
        blocks = blocks.filter((item) => {
            if (canTrimBlock(item)) {
                if (!item.value || (Array.isArray(item.value) && !item.value.length)) {
                    return false;
                }
            }
            return true;
        });
    }
    return blocks;
}

function trimStart<T extends Block>(blocks: T[]): T[] {
    return trimBoundary(blocks, (s) => s.trimStart(), trimStart);
}

function trimEnd<T extends Block>(blocks: T[]): T[] {
    blocks = blocks.reverse();
    let result = trimBoundary(blocks, (s) => s.trimEnd(), trimEnd);
    result = result.reverse();
    return result;
}

function trimBoundary<T extends Block>(blocks: T[], trimString: (s: string) => string, trimArray: (item: InlineBlock[]) => InlineBlock[]): T[] {
    const result: T[] = [];
    let shouldTrim = true;
    blocks.forEach((item) => {
        if (shouldTrim && isInline(item) && !isVoidInline(item)) {
            let value = item.value;
            if (Array.isArray(value)) {
                let array = value as InlineBlock[];
                array = trimArray(array);
                value = toValue(array);
            }
            if (typeof value === 'string') {
                value = trimString(value);
            }
            if (Array.isArray(value) && !value.length) {
                value = undefined;
            }
            if (value) {
                shouldTrim = false;
                result.push({
                    ...item,
                    value
                });
            }
        } else {
            shouldTrim = false;
            result.push(item);
        }
    });
    return result;
}

export function toValue<T extends Block>(blocks: T[]): string | T[] {
    if (blocks.length === 0) {
        return '';
    }
    if (blocks.length === 1 && isSimpleFragment(blocks[0])) {
        return fixWhitespace(blocks[0].value);
    }
    return blocks;
}

export function toText(blocks: Block[], trim: boolean): string {
    let s = blocks.reduce((text, item) => {
        if (typeof item.value === 'string') {
            text += item.value;
        } else if (Array.isArray(item.value)) {
            text += toText(item.value, false);
        }
        return text;
    }, '');
    if (trim) {
        s = s.trim();
        s = fixWhitespace(s);
    }
    return s;
}

export function fixWhitespace(s: string): string {
    return s.replace(/\s+/g, ' ');
}
