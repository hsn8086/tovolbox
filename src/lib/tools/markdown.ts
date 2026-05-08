export type MarkdownHeading = {
  level: number;
  text: string;
  slug: string;
};

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
