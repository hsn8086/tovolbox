import { describe, expect, it } from 'vitest';
import { extractHeadings, generateMarkdownToc, markdownToPlainText } from '@/lib/tools/markdown';

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
});
