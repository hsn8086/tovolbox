import { useMemo, useState } from 'react';
import { extractHeadings, generateMarkdownToc, markdownToPlainText } from '@/lib/tools/markdown';
import { countWords, slugify, toCamelCase, toTitleCase } from '@/lib/tools/text';
import { deduplicateLines, extractEmails, extractNumbers, extractUrls, findAndReplace, removeEmptyLines, sortLines, trimLines } from '@/lib/tools/textExtract';
import { CopyActions, OutputBox, ToolPanel } from './shared';

const modes = ['word-counter', 'case-converter', 'slug-generator', 'extract-emails', 'extract-urls', 'extract-numbers', 'remove-empty-lines', 'deduplicate-lines', 'sort-lines', 'trim-lines', 'find-replace', 'markdown-toc'] as const;
export type TextMode = (typeof modes)[number] | 'generic';

export function getTextMode(component: string): TextMode {
  return modes.includes(component as (typeof modes)[number]) ? component as TextMode : 'generic';
}

export default function TextTool({ component, title }: { component: string; title: string }) {
  const mode = getTextMode(component);
  const [input, setInput] = useState('Hello world\nhello@example.com\nhttps://tovolbox.hsn8086.com/tools/\n42');
  const [find, setFind] = useState('Hello');
  const [replaceWith, setReplaceWith] = useState('Hi');
  const output = useMemo(() => {
    if (mode === 'word-counter') return JSON.stringify(countWords(input), null, 2);
    if (mode === 'case-converter') return [input.toUpperCase(), input.toLowerCase(), toTitleCase(input), toCamelCase(input)].join('\n');
    if (mode === 'slug-generator') return slugify(input);
    if (mode === 'extract-emails') return extractEmails(input).join('\n');
    if (mode === 'extract-urls') return extractUrls(input).join('\n');
    if (mode === 'extract-numbers') return extractNumbers(input).join('\n');
    if (mode === 'remove-empty-lines') return removeEmptyLines(input);
    if (mode === 'deduplicate-lines') return deduplicateLines(input);
    if (mode === 'sort-lines') return sortLines(input);
    if (mode === 'trim-lines') return trimLines(input);
    if (mode === 'find-replace') return findAndReplace(input, find, replaceWith);
    if (mode === 'markdown-toc') return [generateMarkdownToc(input), markdownToPlainText(input), JSON.stringify(extractHeadings(input), null, 2)].join('\n\n');
    return input;
  }, [find, input, mode, replaceWith]);
  return <ToolPanel title={title}>{mode === 'find-replace' && <div className="grid-auto" style={{ marginBottom: '.75rem' }}><label>Find<input className="input" value={find} onChange={(event) => setFind(event.target.value)} /></label><label>Replace<input className="input" value={replaceWith} onChange={(event) => setReplaceWith(event.target.value)} /></label></div>}<label style={{ display: 'block', marginBottom: '.75rem' }}>Input<textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></label><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
