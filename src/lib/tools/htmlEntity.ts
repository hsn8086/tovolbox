const encodeEntityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

const decodeEntityMap: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
    copy: '©',
    reg: '®',
    trade: '™',
    euro: '€',
    pound: '£',
    yen: '¥',
    cent: '¢',
    laquo: '«',
    raquo: '»',
    ndash: '–',
    mdash: '—',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
};

export function encodeHtmlEntities(input: string): string {
    return input.replace(/[&<>"']/g, (character) => encodeEntityMap[character]);
}

export function decodeHtmlEntities(input: string): string {
    return input.replace(/&(#\d+|#x[\da-fA-F]+|[a-zA-Z][\da-zA-Z]+);/g, (entity, value: string) => {
        if (value.startsWith('#x')) {
            return decodeNumericEntity(entity, Number.parseInt(value.slice(2), 16));
        }

        if (value.startsWith('#')) {
            return decodeNumericEntity(entity, Number.parseInt(value.slice(1), 10));
        }

        return decodeEntityMap[value] ?? entity;
    });
}

function decodeNumericEntity(entity: string, codePoint: number): string {
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
        return entity;
    }

    try {
        return String.fromCodePoint(codePoint);
    } catch {
        return entity;
    }
}
