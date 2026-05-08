export type MarkdownHeading = {
  level: number;
  text: string;
  slug: string;
};

export type MarkdownPreview = {
  html: string;
  text: string;
  headings: MarkdownHeading[];
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripInlineMarkdown(input: string): string {
  return input
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/[*_~]+/g, '')
    .replace(/\\([\\`*_[\]{}()#+\-.!>])/g, '$1')
    .trim();
}

function slugifyHeading(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueSlug(baseSlug: string, seen: Map<string, number>): string {
  const slug = baseSlug || 'heading';
  const count = seen.get(slug) ?? 0;
  seen.set(slug, count + 1);

  return count === 0 ? slug : `${slug}-${count}`;
}

function safeHref(input: string): string {
  const value = input.trim();
  if (/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(value)) return escapeHtml(value);
  return '#';
}

function renderInlineMarkdown(input: string): string {
  const pieces: string[] = [];
  let cursor = 0;
  const tokenPattern = /`([^`\n]+)`|\[([^\]]+)]\(([^)\s]+)\)/g;

  function renderText(value: string): string {
    return escapeHtml(value)
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  }

  for (const match of input.matchAll(tokenPattern)) {
    pieces.push(renderText(input.slice(cursor, match.index)));
    if (match[1] !== undefined) {
      pieces.push(`<code>${escapeHtml(match[1])}</code>`);
    } else {
      pieces.push(`<a href="${safeHref(match[3] ?? '')}" target="_blank" rel="nofollow noopener noreferrer">${renderText(match[2] ?? '')}</a>`);
    }
    cursor = (match.index ?? 0) + match[0].length;
  }

  pieces.push(renderText(input.slice(cursor)));
  return pieces.join('');
}

export function markdownToPlainText(input: string): string {
  return input
    .replace(/^```[^\n]*\n([\s\S]*?)\n```$/gm, '$1')
    .replace(/^~~~[^\n]*\n([\s\S]*?)\n~~~$/gm, '$1')
    .replace(/^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .split('\n')
    .map(stripInlineMarkdown)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractHeadings(input: string): MarkdownHeading[] {
  const seen = new Map<string, number>();
  const headings: MarkdownHeading[] = [];
  let inFence = false;
  let fenceMarker = '';

  for (const line of input.split('\n')) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1].charAt(0);
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker === fenceMarker) {
        inFence = false;
        fenceMarker = '';
      }
      continue;
    }

    if (inFence) {
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/);
    if (!headingMatch) {
      continue;
    }

    const text = stripInlineMarkdown(headingMatch[2]);
    headings.push({
      level: headingMatch[1].length,
      text,
      slug: uniqueSlug(slugifyHeading(text), seen),
    });
  }

  return headings;
}

export function generateMarkdownToc(input: string): string {
  return extractHeadings(input)
    .map((heading) => `${'  '.repeat(Math.max(0, heading.level - 1))}- [${heading.text}](#${heading.slug})`)
    .join('\n');
}

export function markdownToSafeHtml(input: string): string {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const seen = new Map<string, number>();
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: 'ol' | 'ul' | undefined;
  let listItems: string[] = [];
  let fenceMarker = '';
  let codeLines: string[] = [];

  function flushParagraph(): void {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  }

  function flushList(): void {
    if (!listType || listItems.length === 0) return;
    html.push(`<${listType}>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</${listType}>`);
    listType = undefined;
    listItems = [];
  }

  function flushCode(): void {
    html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLines = [];
  }

  for (const rawLine of lines) {
    const fenceMatch = rawLine.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      if (!fenceMarker) {
        flushParagraph();
        flushList();
        fenceMarker = fenceMatch[1].charAt(0);
      } else if (fenceMatch[1].charAt(0) === fenceMarker) {
        flushCode();
        fenceMarker = '';
      } else {
        codeLines.push(rawLine);
      }
      continue;
    }

    if (fenceMarker) {
      codeLines.push(rawLine);
      continue;
    }

    const line = rawLine.trim();
    if (line.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const text = stripInlineMarkdown(headingMatch[2]);
      const slug = uniqueSlug(slugifyHeading(text), seen);
      const level = headingMatch[1].length;
      html.push(`<h${level} id="${slug}">${renderInlineMarkdown(text)}</h${level}>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*+]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const nextType = orderedMatch ? 'ol' : 'ul';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push((orderedMatch ?? unorderedMatch)![1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  if (fenceMarker) flushCode();

  return html.join('\n');
}

export function buildMarkdownPreview(input: string): MarkdownPreview {
  return {
    html: markdownToSafeHtml(input),
    text: markdownToPlainText(input),
    headings: extractHeadings(input),
  };
}
