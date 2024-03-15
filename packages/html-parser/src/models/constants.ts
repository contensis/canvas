import { LanguageAlias, PanelType } from './models';

export const PanelTypes: PanelType[] = ['info', 'note', 'warning', 'success', 'error'];

export const LANGUAGES: LanguageAlias[] = [
    { id: 'csharp', alias: ['c#', 'cs'] },
    { id: 'cshtml', alias: ['razor'] },
    { id: 'dockerfile', alias: ['docker'] },
    { id: 'handlebars', alias: ['hbs'] },
    { id: 'html', alias: ['htm'] },
    { id: 'javascript', alias: ['js'] },
    { id: 'json' },
    { id: 'jsx' },
    { id: 'markdown', alias: ['md'] },
    { id: 'php' },
    { id: 'python', alias: ['py'] },
    { id: 'scss' },
    { id: 'sass' },
    { id: 'sql' },
    { id: 'typescript', alias: ['ts'] },
    { id: 'tsx' },
    { id: 'xml' },
    { id: 'yaml', alias: ['yml'] }
];

export const DEFAULT_LANGUAGE = 'javascript';

function isAllowedLanguage(language: string, allowed?: string[]) {
    return !allowed || allowed.includes(language);
}

export function toLanguageId(languageOrAlias: string, allowed?: string[]) {
    if (languageOrAlias) {
        languageOrAlias = languageOrAlias.toLowerCase();
        const language = LANGUAGES.find((l) => l.id === languageOrAlias || l.alias?.includes(languageOrAlias));
        if (language?.id && isAllowedLanguage(language.id, allowed)) {
            return language.id;
        }
    }
    if (!allowed?.length) {
        return DEFAULT_LANGUAGE;
    }
    if (isAllowedLanguage(DEFAULT_LANGUAGE, allowed)) {
        return DEFAULT_LANGUAGE;
    }
    return allowed[0];
}
