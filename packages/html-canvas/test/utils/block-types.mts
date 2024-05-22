import { Block, LinkBlock } from '@contensis/canvas-types';

export const getAllBlockTypes = (blocks: Block[], types: Block['type'][] = []) => {
  for (const block of blocks) {
    types.push(block.type);
    if (Array.isArray(block.value)) getAllBlockTypes(block.value, types);
  }
  return types;
};

export const getAllLinkBlocks = (blocks: Block[], links: LinkBlock[] = []) => {
  for (const block of blocks) {
    if (block.type === '_link') links.push(block);
    if (Array.isArray(block.value)) getAllLinkBlocks(block.value, links);
  }
  return links;
};
