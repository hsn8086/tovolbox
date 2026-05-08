import { describe, expect, it } from 'vitest';
import { buildMarkdownPreview, extractHeadings, generateMarkdownToc, markdownToPlainText, markdownToSafeHtml } from '@/lib/tools/markdown';

describe('markdown pure functions', () => {
  it('converts markdown basics to plain text', () => {
    const input = [
      '# Hello **Markdown**',
      '',
      'Visit [the docs](https://example.com) and read *carefully*.',
      '',
      'Use `const value = 1` inline.',
      '',
      '```ts',
      'const code = true;',
      '```',
    ].join('\n');

    expect(markdownToPlainText(input)).toBe(
      ['Hello Markdown', '', 'Visit the docs and read carefully.', '', 'Use const value = 1 inline.', '', 'const code = true;'].join(
        '\n',
      ),
    );
  });

  it('extracts ATX headings with plain text and stable slugs', () => {
    const input = [
      '# Intro',
      '## Using [Links](https://example.com) and *Emphasis* ##',
      '```md',
      '# Not a heading',
      '```',
      '### Intro',
    ].join('\n');

    expect(extractHeadings(input)).toEqual([
      { level: 1, text: 'Intro', slug: 'intro' },
      { level: 2, text: 'Using Links and Emphasis', slug: 'using-links-and-emphasis' },
      { level: 3, text: 'Intro', slug: 'intro-1' },
    ]);
  });

  it('generates an indented markdown table of contents', () => {
    const input = ['# Title', '## Install', '### Install', '#### `Code` Blocks'].join('\n');

    expect(generateMarkdownToc(input)).toBe(
      ['- [Title](#title)', '  - [Install](#install)', '    - [Install](#install-1)', '      - [Code Blocks](#code-blocks)'].join(
        '\n',
      ),
    );
  });

  it('renders a safe markdown preview without trusting raw HTML or script links', () => {
    const input = [
      '# Preview',
      '',
      'Use **bold**, *emphasis*, `code`, and [safe](https://example.com).',
      '',
      '- first item',
      '- <script>alert(1)</script>',
      '',
      '[bad](javascript:alert(1))',
    ].join('\n');

    expect(markdownToSafeHtml(input)).toContain('<h1 id="preview">Preview</h1>');
    expect(markdownToSafeHtml(input)).toContain('<strong>bold</strong>');
    expect(markdownToSafeHtml(input)).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(markdownToSafeHtml(input)).toContain('href="#"');
    expect(markdownToSafeHtml(input)).not.toContain('<script>');
    expect(markdownToSafeHtml(input)).not.toContain('javascript:');
  });

  it('builds preview html text and heading metadata together', () => {
    const preview = buildMarkdownPreview('# Title\n\nBody text');

    expect(preview.html).toContain('<h1 id="title">Title</h1>');
    expect(preview.text).toBe('Title\n\nBody text');
    expect(preview.headings).toEqual([{ level: 1, text: 'Title', slug: 'title' }]);
  });
});
