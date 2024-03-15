import { FragmentDefinition } from './fragment-definition';

export const InlineFragments: FragmentDefinition[] = [
    { shortcut: '**', tag: 'strong', isMarkdownExtension: false, setting: 'decorator.strong' },
    { shortcut: '__', tag: 'strong', isMarkdownExtension: false, setting: 'decorator.strong' },
    { shortcut: '*', tag: 'em', isMarkdownExtension: false, setting: 'decorator.emphasis' },
    { shortcut: '_', tag: 'em', isMarkdownExtension: false, setting: 'decorator.emphasis' },
    { shortcut: '`', tag: 'code', isMarkdownExtension: false, setting: 'decorator.code' },
    { shortcut: '~~', tag: 's', isMarkdownExtension: false, setting: 'decorator.strikethrough' },

    // i have added a double backtick for code, which is not standard,
    // this is added to work around the issue where a single backtick is inline code but triple backtick is a code block
    // you can;t actually type a triple backtick because once you enter the 2nd one it thinks you are entering inline code
    { shortcut: '``', tag: 'code', isMarkdownExtension: true, setting: 'decorator.code' },

    // extended marks from http://tmthydvnprt.com/quilt/news/markdown_syntax.html
    { shortcut: '***', tag: 'u', isMarkdownExtension: true, setting: 'decorator.underline' },
    { shortcut: '^', tag: 'sup', isMarkdownExtension: true, setting: 'decorator.superscript' },
    { shortcut: '~', tag: 'sub', isMarkdownExtension: true, setting: 'decorator.subscript' },
    { shortcut: '--', tag: 'del', isMarkdownExtension: true, setting: 'decorator.delete' },
    { shortcut: '++', tag: 'ins', isMarkdownExtension: true, setting: 'decorator.insert' },
    { shortcut: '==', tag: 'mark', isMarkdownExtension: true, setting: 'decorator.mark' },
    { shortcut: '::', tag: 'kbd', isMarkdownExtension: true, setting: 'decorator.keyboard' },
    { shortcut: '%', tag: 'var', isMarkdownExtension: true, setting: 'decorator.variable' }
];
