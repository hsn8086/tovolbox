export type FormatResult = {
  ok: boolean;
  output: string;
  error?: string;
};

const htmlVoidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function line(indent: number, value: string): string {
  return `${'  '.repeat(Math.max(0, indent))}${value.trim()}`;
}

function tagName(token: string): string {
  return token.match(/^<\/?\s*([a-zA-Z][\w:-]*)/)?.[1]?.toLowerCase() ?? '';
}

function formatMarkup(input: string, mode: 'xml' | 'html'): FormatResult {
  try {
    const trimmed = input.trim();
    if (trimmed.length === 0) return { ok: true, output: '' };

    const tokens = trimmed.match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[\s\S]*?>|<\?[\s\S]*?\?>|<[^>]+>|[^<]+/gi) ?? [];
    const lines: string[] = [];
    let indent = 0;

    for (const rawToken of tokens) {
      const token = rawToken.trim();
      if (token.length === 0) continue;

      if (token.startsWith('</')) {
        indent -= 1;
        lines.push(line(indent, token));
        continue;
      }

      const name = tagName(token);
      const isDeclaration = /^<!|^<\?/.test(token);
      const isSelfClosing = /\/>$/.test(token) || isDeclaration || (mode === 'html' && htmlVoidTags.has(name));

      lines.push(line(indent, token));
      if (token.startsWith('<') && !isSelfClosing) indent += 1;
    }

    return { ok: true, output: lines.join('\n') };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : `Unable to format ${mode.toUpperCase()}` };
  }
}

export function formatXml(input: string): FormatResult {
  return formatMarkup(input, 'xml');
}

export function formatHtml(input: string): FormatResult {
  return formatMarkup(input, 'html');
}

export function formatCss(input: string): FormatResult {
  try {
    const trimmed = input.trim();
    if (trimmed.length === 0) return { ok: true, output: '' };

    const lines: string[] = [];
    let current = '';
    let indent = 0;
    let quote: string | undefined;

    function flush(suffix = ''): void {
      const value = current.trim();
      if (value.length > 0) lines.push(line(indent, `${value}${suffix}`));
      current = '';
    }

    for (let index = 0; index < trimmed.length; index += 1) {
      const char = trimmed[index];
      const next = trimmed[index + 1];

      if (quote) {
        current += char;
        if (char === '\\' && next) {
          current += next;
          index += 1;
        } else if (char === quote) {
          quote = undefined;
        }
        continue;
      }

      if (char === '"' || char === "'") {
        quote = char;
        current += char;
        continue;
      }

      if (char === '/' && next === '*') {
        const end = trimmed.indexOf('*/', index + 2);
        const comment = end === -1 ? trimmed.slice(index) : trimmed.slice(index, end + 2);
        if (current.trim().length > 0) flush();
        lines.push(line(indent, comment));
        index = end === -1 ? trimmed.length : end + 1;
        continue;
      }

      if (char === '{') {
        flush(' {');
        indent += 1;
        continue;
      }

      if (char === '}') {
        flush();
        indent -= 1;
        lines.push(line(indent, '}'));
        continue;
      }

      if (char === ';') {
        flush(';');
        continue;
      }

      current += /\s/.test(char) ? ' ' : char;
    }

    flush();
    return { ok: true, output: lines.join('\n') };
  } catch (error) {
    return { ok: false, output: '', error: error instanceof Error ? error.message : 'Unable to format CSS' };
  }
}
