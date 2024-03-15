import { CanvasSetting } from '../models';

export interface FragmentDefinition {
    shortcut: string;
    tag: string;
    isMarkdownExtension: boolean;
    setting: CanvasSetting;
}
