import type { ReactNode } from 'react';

export function CopyActions({ output, onClear }: { output: string; onClear: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '.75rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
      <button className="btn" type="button" onClick={() => void navigator.clipboard.writeText(output)}>Copy result</button>
      <button className="btn btn-secondary" type="button" onClick={onClear}>Clear</button>
    </div>
  );
}

export function OutputBox({ value }: { value: string }) {
  return (
    <label style={{ display: 'block' }}>
      Output
      <textarea className="textarea ltr-only" readOnly value={value} />
    </label>
  );
}

export function ToolPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="card" style={{ padding: '1.25rem' }}><h2 style={{ marginTop: 0 }}>{title}</h2>{children}</section>;
}
