module.exports = {
    printWidth: 160,
    trailingComma: 'none',
    singleQuote: true,
    proseWrap: 'always',
    tabWidth: 2,
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx', '*.html', '*.scss'],
            options: {
                tabWidth: 4
            }
        }
    ]
};
