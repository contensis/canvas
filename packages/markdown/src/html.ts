const encodeMap = {
    161: '&iexcl;',
    162: '&cent;',
    163: '&pound;',
    164: '&curren;',
    165: '&yen;',
    166: '&brvbar;',
    167: '&sect;',
    168: '&uml;',
    169: '&copy;',
    170: '&ordf;',
    171: '&laquo;',
    172: '&not;',
    173: '&shy;',
    174: '&reg;',
    175: '&macr;',
    176: '&deg;',
    177: '&plusmn;',
    178: '&sup2;',
    179: '&sup3;',
    180: '&acute;',
    181: '&micro;',
    182: '&para;',
    184: '&cedil;',
    185: '&sup1;',
    186: '&ordm;',
    187: '&raquo;',
    188: '&frac14;',
    189: '&frac12;',
    190: '&frac34;',
    191: '&iquest;',
    215: '&times;',
    247: '&divide;',
    8211: '&ndash;',
    8212: '&mdash;',
    8216: '&lsquo;',
    8217: '&rsquo;',
    8218: '&sbquo;',
    8220: '&ldquo;',
    8221: '&rdquo;',
    8222: '&bdquo;',
    8226: '&bull;',
    8249: '&lsaquo;',
    8250: '&rsaquo;',
    8364: '&euro;',
    8482: '&trade;'
};

const SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const NON_ALPHANUMERIC_REGEXP = /([^#-~ |!])/g;

// this is duplicated in the html renderer so any changes need to be done there as well
export function htmlEncode(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/[ ]{2,}/g, function (match: string) {
            return ' ' + '&nbsp;'.repeat(match.length - 1);
        })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/`/g, '&grave;')
        .replace(SURROGATE_PAIR_REGEXP, function (match: string) {
            const hi = match.charCodeAt(0);
            const low = match.charCodeAt(1);
            return '&#' + ((hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000) + ';';
        })
        .replace(NON_ALPHANUMERIC_REGEXP, function (match: string) {
            const charCode = match.charCodeAt(0);
            return encodeMap[charCode] || `&#${charCode};`;
        });
}
