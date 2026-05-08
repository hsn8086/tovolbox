import { useMemo, useState } from 'react';
import { extractHeadings, generateMarkdownToc, markdownToPlainText } from '@/lib/tools/markdown';
import { countWords, slugify, toCamelCase, toTitleCase } from '@/lib/tools/text';
import { deduplicateLines, extractEmails, extractNumbers, extractUrls, findAndReplace, formatLineDiff, generateLoremIpsum, removeEmptyLines, sortLines, trimLines } from '@/lib/tools/textExtract';
import { CopyActions, Field, FieldGrid, OutputBox, ToolPanel } from './shared';

const modes = ['word-counter', 'case-converter', 'slug-generator', 'extract-emails', 'extract-urls', 'extract-numbers', 'remove-empty-lines', 'deduplicate-lines', 'sort-lines', 'trim-lines', 'find-replace', 'markdown-toc', 'diff-checker', 'lorem-ipsum-generator'] as const;
export type TextMode = (typeof modes)[number] | 'generic';

export function getTextMode(component: string): TextMode {
  return modes.includes(component as (typeof modes)[number]) ? component as TextMode : 'generic';
}

export default function TextTool({ component, title, privacyNote }: { component: string; title: string; privacyNote: string }) {
  const mode = getTextMode(component);
  const [input, setInput] = useState('Hello world\nhello@example.com\nhttps://tovolbox.hsn8086.com/tools/\n42');
  const [changed, setChanged] = useState('Hello world\nhello@example.com\nhttps://tovolbox.hsn8086.com/search/\n42\nnew line');
  const [find, setFind] = useState('Hello');
  const [replaceWith, setReplaceWith] = useState('Hi');
  const [paragraphCount, setParagraphCount] = useState('3');
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState('4');
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
    if (mode === 'diff-checker') return formatLineDiff(input, changed);
    if (mode === 'lorem-ipsum-generator') return generateLoremIpsum(Number(paragraphCount), Number(sentencesPerParagraph));
    return input;
  }, [changed, find, input, mode, paragraphCount, replaceWith, sentencesPerParagraph]);
  return <ToolPanel title={title} privacyNote={privacyNote}>{mode === 'find-replace' && <FieldGrid style={{ marginBottom: '.75rem' }}><label>Find<input className="input" value={find} onChange={(event) => setFind(event.target.value)} /></label><label>Replace<input className="input" value={replaceWith} onChange={(event) => setReplaceWith(event.target.value)} /></label></FieldGrid>}{mode === 'diff-checker' ? <><Field label="Original text"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field><Field label="Changed text"><textarea className="textarea" value={changed} onChange={(event) => setChanged(event.target.value)} /></Field></> : mode === 'lorem-ipsum-generator' ? <FieldGrid style={{ marginBottom: '.75rem' }}><Field label="Paragraphs"><input className="input" value={paragraphCount} onChange={(event) => setParagraphCount(event.target.value)} /></Field><Field label="Sentences per paragraph"><input className="input" value={sentencesPerParagraph} onChange={(event) => setSentencesPerParagraph(event.target.value)} /></Field></FieldGrid> : <Field label="Input"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field>}<OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
