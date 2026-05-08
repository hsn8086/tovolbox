const dangerousElementPattern = /<\s*(?:[\w-]+:)?script\b[^>]*>[\s\S]*?<\s*\/\s*(?:[\w-]+:)?script\s*>/gi;
const selfClosingDangerousElementPattern = /<\s*(?:[\w-]+:)?script\b[^>]*\/\s*>/gi;
const eventAttributePattern = /\s+on[a-z][\w:-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi;
const hrefAttributePattern = /\s+(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
const tagBoundaryPattern = />\s*</g;
const commentPattern = /<!--[\s\S]*?-->/g;

const jsxAttributeMap: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'viewbox': 'viewBox',
};

function decodeCharacterReferences(input: string): string {
  return input.replace(/&(#\d+|#x[\da-f]+|colon);/gi, (entity, value: string) => {
    if (value.toLowerCase() === 'colon') {
      return ':';
    }

    const codePoint = value.toLowerCase().startsWith('#x')
      ? Number.parseInt(value.slice(2), 16)
      : Number.parseInt(value.slice(1), 10);

    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
      return entity;
    }

    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return entity;
    }
  });
}

function isDangerousHref(value: string): boolean {
  return decodeCharacterReferences(value).replace(/[\u0000-\u0020]+/g, '').toLowerCase().startsWith('javascript:');
}

function camelCaseAttribute(attribute: string): string {
  const lowerAttribute = attribute.toLowerCase();
  const mappedAttribute = jsxAttributeMap[lowerAttribute];

  if (mappedAttribute) {
    return mappedAttribute;
  }

  return lowerAttribute.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase());
}

export function sanitizeSvgForPreview(input: string): string {
  return input
    .replace(dangerousElementPattern, '')
    .replace(selfClosingDangerousElementPattern, '')
    .replace(eventAttributePattern, '')
    .replace(hrefAttributePattern, (attribute, doubleQuoted: string | undefined, singleQuoted: string | undefined, unquoted: string | undefined) => {
      const value = doubleQuoted ?? singleQuoted ?? unquoted ?? '';

      return isDangerousHref(value) ? '' : attribute;
    })
    .trim();
}

export function minifySvg(input: string): string {
  return sanitizeSvgForPreview(input)
    .replace(commentPattern, '')
    .replace(/\s+/g, ' ')
    .replace(tagBoundaryPattern, '><')
    .replace(/\s+\/?>/g, (match) => match.trimStart())
    .trim();
}

export function formatSvg(input: string): string {
  const compactSvg = minifySvg(input);

  if (!compactSvg) {
    return '';
  }

  const lines: string[] = [];
  let depth = 0;
  const tokens = compactSvg.match(/<[^>]+>|[^<]+/g) ?? [];

  for (const token of tokens) {
    const trimmedToken = token.trim();

    if (!trimmedToken) {
      continue;
    }

    if (/^<\//.test(trimmedToken)) {
      depth = Math.max(0, depth - 1);
    }

    lines.push(`${'  '.repeat(depth)}${trimmedToken}`);

    if (/^<[^!?/]/.test(trimmedToken) && !/\/\s*>$/.test(trimmedToken)) {
      depth += 1;
    }
  }

  return lines.join('\n');
}

export function svgToDataUri(input: string): string {
  const encodedSvg = encodeURIComponent(minifySvg(input))
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%22/g, "'");

  return `data:image/svg+xml,${encodedSvg}`;
}

export function svgToJsx(input: string): string {
  return formatSvg(input)
    .replace(/\s([a-zA-Z_:][\w:.-]*)=/g, (_, attribute: string) => ` ${camelCaseAttribute(attribute)}=`)
    .replace(/\bstyle="([^"]*)"/g, (_, value: string) => `style={${JSON.stringify(value)}}`)
    .replace(/\bstyle='([^']*)'/g, (_, value: string) => `style={${JSON.stringify(value)}}`);
}
