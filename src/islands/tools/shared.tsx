import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

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

export function PrivacyNote({ children }: { children: ReactNode }) {
  return <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{children}</p>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label style={{ display: 'block', marginBottom: '.75rem' }}>{label}{children}</label>;
}

export function FieldGrid({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="grid-auto" style={style}>{children}</div>;
}

export function ToolPanel({ title, privacyNote, children }: { title: string; privacyNote?: string; children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return <section className="card" data-tool-ready={isHydrated ? 'true' : 'false'} style={{ padding: '1.25rem' }}><h2 style={{ marginTop: 0 }}>{title}</h2>{privacyNote && <PrivacyNote>{privacyNote}</PrivacyNote>}{children}</section>;
}
