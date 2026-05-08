import { useEffect, useMemo, useState } from 'react';
import { decodeBase64, decodeJwt, encodeBase64, safeDecodeURIComponent } from '@/lib/tools/codec';
import { hashText } from '@/lib/tools/hash';
import { decodeHtmlEntities, encodeHtmlEntities } from '@/lib/tools/htmlEntity';
import { generateUlid, generateUuidV4 } from '@/lib/tools/ids';
import { generatePassword, generateRandomString } from '@/lib/tools/random';
import { CopyActions, Field, OutputBox, ToolPanel } from './shared';

export function getEncodeCryptoMode(component: string): string {
  if (component.startsWith('hash-')) return component;
  if (['base64', 'url-codec', 'html-entity', 'jwt-decoder', 'password-generator', 'random-string-generator', 'uuid-generator', 'ulid-generator'].includes(component)) return component;
  return 'generic';
}

export default function EncodeCryptoTool({ component, title, privacyNote }: { component: string; title: string; privacyNote: string }) {
  const mode = getEncodeCryptoMode(component);
  const [input, setInput] = useState(mode.startsWith('hash-') ? '' : 'hello');
  const [operation, setOperation] = useState('encode');
  const [asyncOutput, setAsyncOutput] = useState('');
  useEffect(() => {
    if (!mode.startsWith('hash-')) return;
    let cancelled = false;
    const algorithm = mode === 'hash-sha1' ? 'SHA-1' : mode === 'hash-sha512' ? 'SHA-512' : 'SHA-256';
    void hashText(input, algorithm)
      .then((result) => { if (!cancelled) setAsyncOutput(result); })
      .catch((error: unknown) => { if (!cancelled) setAsyncOutput(error instanceof Error ? error.message : 'Hash failed.'); });
    return () => { cancelled = true; };
  }, [input, mode]);
  const output = useMemo(() => {
    try {
      if (mode === 'base64') return operation === 'encode' ? encodeBase64(input) : decodeBase64(input);
      if (mode === 'url-codec') return operation === 'encode' ? encodeURIComponent(input) : safeDecodeURIComponent(input).output;
      if (mode === 'html-entity') return operation === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
      if (mode === 'jwt-decoder') return JSON.stringify(decodeJwt(input), null, 2);
      if (mode === 'password-generator') return generatePassword({ length: Number(input || 16), symbols: true });
      if (mode === 'random-string-generator') return generateRandomString(Number(input || 24));
      if (mode === 'uuid-generator') return generateUuidV4();
      if (mode === 'ulid-generator') return generateUlid();
      if (mode.startsWith('hash-')) return asyncOutput;
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Unable to process input.'; }
  }, [asyncOutput, input, mode, operation]);
  return <ToolPanel title={title} privacyNote={privacyNote}>{['base64', 'url-codec', 'html-entity'].includes(mode) && <Field label="Mode"><select className="select" value={operation} onChange={(event) => setOperation(event.target.value)}><option value="encode">Encode</option><option value="decode">Decode</option></select></Field>}<Field label="Input"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
