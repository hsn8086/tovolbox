import { useMemo, useState } from 'react';
import { compoundInterest, convertNumberBase, discountPrice, loanPayment, percentageChange, percentageOf } from '@/lib/tools/calculators';
import { explainCron } from '@/lib/tools/cron';
import { estimateBase64Size, humanFileSummary } from '@/lib/tools/fileTools';
import { buildMailtoPayload, buildVCardPayload, buildWifiQrPayload, validateEan13 } from '@/lib/tools/qr';
import { testRegex } from '@/lib/tools/regex';
import { CopyActions, OutputBox, ToolPanel } from './shared';

const modes = ['regex-tester', 'cron-explainer', 'percentage-calculator', 'percentage-change', 'discount-calculator', 'loan-calculator', 'compound-interest', 'number-base-converter', 'wifi-qr-payload', 'vcard-payload', 'mailto-builder', 'ean13-validator', 'file-summary', 'base64-size-estimator'] as const;
export function getDeveloperMode(component: string): string { return modes.includes(component as never) ? component : 'generic'; }

export default function DeveloperTool({ component, title }: { component: string; title: string }) {
  const mode = getDeveloperMode(component);
  const [input, setInput] = useState(mode === 'cron-explainer' ? '*/5 9-17 * * 1-5' : '42');
  const output = useMemo(() => {
    try {
      const n = Number(input || 0);
      if (mode === 'regex-tester') return JSON.stringify(testRegex('\\b\\w{4,}\\b', 'gi', input), null, 2);
      if (mode === 'cron-explainer') return JSON.stringify(explainCron(input), null, 2);
      if (mode === 'percentage-calculator') return String(percentageOf(n, 200));
      if (mode === 'percentage-change') return String(percentageChange(100, n));
      if (mode === 'discount-calculator') return String(discountPrice(100, n));
      if (mode === 'loan-calculator') return String(loanPayment(n || 100000, 5, 30).toFixed(2));
      if (mode === 'compound-interest') return String(compoundInterest(n || 1000, 6, 10).toFixed(2));
      if (mode === 'number-base-converter') return convertNumberBase(input || 'FF', 16, 10);
      if (mode === 'wifi-qr-payload') return buildWifiQrPayload({ ssid: input || 'TovolBox', password: 'secret-pass' });
      if (mode === 'vcard-payload') return buildVCardPayload({ firstName: 'Ada', lastName: 'Lovelace', email: input || 'ada@example.com' });
      if (mode === 'mailto-builder') return buildMailtoPayload({ to: input || 'hello@example.com', subject: 'Hello' });
      if (mode === 'ean13-validator') return String(validateEan13(input || '4006381333931'));
      if (mode === 'file-summary') return humanFileSummary({ name: input || 'report.pdf', size: 1536000, type: 'application/pdf' });
      if (mode === 'base64-size-estimator') return String(estimateBase64Size(n));
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Unable to calculate.'; }
  }, [input, mode]);
  return <ToolPanel title={title}><label style={{ display: 'block', marginBottom: '.75rem' }}>Input<textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></label><OutputBox value={output} /><CopyActions output={output} onClear={() => setInput('')} /></ToolPanel>;
}
