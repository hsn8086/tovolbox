import { useMemo, useState } from 'react';
import { compoundInterest, convertNumberBase, discountPrice, loanPayment, percentageChange, percentageOf } from '@/lib/tools/calculators';
import { explainCron } from '@/lib/tools/cron';
import { estimateBase64Size, humanFileSummary } from '@/lib/tools/fileTools';
import { buildMailtoPayload, buildVCardPayload, buildWifiQrPayload, validateEan13 } from '@/lib/tools/qr';
import { testRegex } from '@/lib/tools/regex';
import { CopyActions, Field, FieldGrid, OutputBox, ToolPanel } from './shared';

const modes = ['regex-tester', 'cron-explainer', 'percentage-calculator', 'percentage-change', 'discount-calculator', 'loan-calculator', 'compound-interest', 'number-base-converter', 'wifi-qr-payload', 'vcard-payload', 'mailto-builder', 'ean13-validator', 'file-summary', 'base64-size-estimator'] as const;
export function getDeveloperMode(component: string): string { return modes.includes(component as never) ? component : 'generic'; }

export default function DeveloperTool({ component, title }: { component: string; title: string }) {
  const mode = getDeveloperMode(component);
  const [input, setInput] = useState(mode === 'cron-explainer' ? '*/5 9-17 * * 1-5' : '42');
  const [percentage, setPercentage] = useState({ value: '25', total: '200' });
  const [percentageChangeInput, setPercentageChangeInput] = useState({ previous: '100', current: '125' });
  const [discount, setDiscount] = useState({ price: '100', percent: '25' });
  const [loan, setLoan] = useState({ principal: '100000', annualRate: '6', years: '30', paymentsPerYear: '12' });
  const [compound, setCompound] = useState({ principal: '1000', annualRate: '5', years: '10', compoundsPerYear: '12' });
  const [regex, setRegex] = useState({ pattern: '\\b\\w{4,}\\b', flags: 'gi', text: 'fast local tools' });
  const [cron, setCron] = useState('*/5 9-17 * * 1-5');
  const [base, setBase] = useState({ value: 'FF', from: '16', to: '10' });
  const output = useMemo(() => {
    try {
      const n = Number(input || 0);
      if (mode === 'regex-tester') return JSON.stringify(testRegex(regex.pattern, regex.flags, regex.text), null, 2);
      if (mode === 'cron-explainer') return JSON.stringify(explainCron(cron), null, 2);
      if (mode === 'percentage-calculator') return buildPercentageOutput(percentage.value, percentage.total);
      if (mode === 'percentage-change') return buildPercentageChangeOutput(percentageChangeInput.previous, percentageChangeInput.current);
      if (mode === 'discount-calculator') return buildDiscountOutput(discount.price, discount.percent);
      if (mode === 'loan-calculator') return buildLoanOutput(loan.principal, loan.annualRate, loan.years, loan.paymentsPerYear);
      if (mode === 'compound-interest') return buildCompoundOutput(compound.principal, compound.annualRate, compound.years, compound.compoundsPerYear);
      if (mode === 'number-base-converter') return convertNumberBase(base.value, readInteger(base.from, 'From base'), readInteger(base.to, 'To base'));
      if (mode === 'wifi-qr-payload') return buildWifiQrPayload({ ssid: input || 'TovolBox', password: 'secret-pass' });
      if (mode === 'vcard-payload') return buildVCardPayload({ firstName: 'Ada', lastName: 'Lovelace', email: input || 'ada@example.com' });
      if (mode === 'mailto-builder') return buildMailtoPayload({ to: input || 'hello@example.com', subject: 'Hello' });
      if (mode === 'ean13-validator') return String(validateEan13(input || '4006381333931'));
      if (mode === 'file-summary') return humanFileSummary({ name: input || 'report.pdf', size: 1536000, type: 'application/pdf' });
      if (mode === 'base64-size-estimator') return String(estimateBase64Size(n));
      return input;
    } catch (error) { return error instanceof Error ? error.message : 'Unable to calculate.'; }
  }, [base, compound, cron, discount, input, loan, mode, percentage, percentageChangeInput, regex]);

  function clearCurrentInput() {
    if (mode === 'regex-tester') setRegex({ pattern: '', flags: '', text: '' });
    else if (mode === 'cron-explainer') setCron('');
    else if (mode === 'number-base-converter') setBase({ value: '', from: '', to: '' });
    else if (mode === 'percentage-calculator') setPercentage({ value: '', total: '' });
    else if (mode === 'percentage-change') setPercentageChangeInput({ previous: '', current: '' });
    else if (mode === 'discount-calculator') setDiscount({ price: '', percent: '' });
    else if (mode === 'loan-calculator') setLoan({ principal: '', annualRate: '', years: '', paymentsPerYear: '' });
    else if (mode === 'compound-interest') setCompound({ principal: '', annualRate: '', years: '', compoundsPerYear: '' });
    else setInput('');
  }

  return (
    <ToolPanel title={title}>
      {mode === 'regex-tester' ? (
        <>
          <FieldGrid>
            <Field label="Pattern"><input className="input ltr-only" value={regex.pattern} onChange={(event) => setRegex((current) => ({ ...current, pattern: event.target.value }))} /></Field>
            <Field label="Flags"><input className="input ltr-only" value={regex.flags} onChange={(event) => setRegex((current) => ({ ...current, flags: event.target.value }))} /></Field>
          </FieldGrid>
          <Field label="Test text"><textarea className="textarea" value={regex.text} onChange={(event) => setRegex((current) => ({ ...current, text: event.target.value }))} /></Field>
        </>
      ) : mode === 'cron-explainer' ? (
        <Field label="Cron expression"><input className="input ltr-only" value={cron} onChange={(event) => setCron(event.target.value)} /></Field>
      ) : mode === 'number-base-converter' ? (
        <FieldGrid>
          <Field label="Value"><input className="input ltr-only" value={base.value} onChange={(event) => setBase((current) => ({ ...current, value: event.target.value }))} /></Field>
          <Field label="From base"><input className="input" value={base.from} onChange={(event) => setBase((current) => ({ ...current, from: event.target.value }))} /></Field>
          <Field label="To base"><input className="input" value={base.to} onChange={(event) => setBase((current) => ({ ...current, to: event.target.value }))} /></Field>
        </FieldGrid>
      ) : mode === 'percentage-calculator' ? (
        <FieldGrid>
          <Field label="Value"><input className="input" value={percentage.value} onChange={(event) => setPercentage((current) => ({ ...current, value: event.target.value }))} /></Field>
          <Field label="Total"><input className="input" value={percentage.total} onChange={(event) => setPercentage((current) => ({ ...current, total: event.target.value }))} /></Field>
        </FieldGrid>
      ) : mode === 'percentage-change' ? (
        <FieldGrid>
          <Field label="Previous value"><input className="input" value={percentageChangeInput.previous} onChange={(event) => setPercentageChangeInput((current) => ({ ...current, previous: event.target.value }))} /></Field>
          <Field label="Current value"><input className="input" value={percentageChangeInput.current} onChange={(event) => setPercentageChangeInput((current) => ({ ...current, current: event.target.value }))} /></Field>
        </FieldGrid>
      ) : mode === 'discount-calculator' ? (
        <FieldGrid>
          <Field label="Original price"><input className="input" value={discount.price} onChange={(event) => setDiscount((current) => ({ ...current, price: event.target.value }))} /></Field>
          <Field label="Discount percent"><input className="input" value={discount.percent} onChange={(event) => setDiscount((current) => ({ ...current, percent: event.target.value }))} /></Field>
        </FieldGrid>
      ) : mode === 'loan-calculator' ? (
        <FieldGrid>
          <Field label="Principal"><input className="input" value={loan.principal} onChange={(event) => setLoan((current) => ({ ...current, principal: event.target.value }))} /></Field>
          <Field label="Annual rate"><input className="input" value={loan.annualRate} onChange={(event) => setLoan((current) => ({ ...current, annualRate: event.target.value }))} /></Field>
          <Field label="Years"><input className="input" value={loan.years} onChange={(event) => setLoan((current) => ({ ...current, years: event.target.value }))} /></Field>
          <Field label="Payments per year"><input className="input" value={loan.paymentsPerYear} onChange={(event) => setLoan((current) => ({ ...current, paymentsPerYear: event.target.value }))} /></Field>
        </FieldGrid>
      ) : mode === 'compound-interest' ? (
        <FieldGrid>
          <Field label="Principal"><input className="input" value={compound.principal} onChange={(event) => setCompound((current) => ({ ...current, principal: event.target.value }))} /></Field>
          <Field label="Annual rate"><input className="input" value={compound.annualRate} onChange={(event) => setCompound((current) => ({ ...current, annualRate: event.target.value }))} /></Field>
          <Field label="Years"><input className="input" value={compound.years} onChange={(event) => setCompound((current) => ({ ...current, years: event.target.value }))} /></Field>
          <Field label="Compounds per year"><input className="input" value={compound.compoundsPerYear} onChange={(event) => setCompound((current) => ({ ...current, compoundsPerYear: event.target.value }))} /></Field>
        </FieldGrid>
      ) : (
        <Field label="Input"><textarea className="textarea" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
      )}
      <OutputBox value={output} />
      <CopyActions output={output} onClear={clearCurrentInput} />
    </ToolPanel>
  );
}

function buildPercentageOutput(valueInput: string, totalInput: string): string {
  const value = readNumber(valueInput, 'Value');
  const total = readNumber(totalInput, 'Total');
  const percent = percentageOf(value, total);
  return `${formatNumber(percent)}%\n${formatNumber(value)} is ${formatNumber(percent)}% of ${formatNumber(total)}.`;
}

function buildPercentageChangeOutput(previousInput: string, currentInput: string): string {
  const previous = readNumber(previousInput, 'Previous value');
  const current = readNumber(currentInput, 'Current value');
  const change = percentageChange(previous, current);
  const direction = change >= 0 ? 'increase' : 'decrease';
  const signedChange = change > 0 ? `+${formatNumber(change)}` : formatNumber(change);
  return `${signedChange}%\n${direction} from ${formatNumber(previous)} to ${formatNumber(current)}.`;
}

function buildDiscountOutput(priceInput: string, percentInput: string): string {
  const price = readNumber(priceInput, 'Original price');
  const percent = readNumber(percentInput, 'Discount percent');
  const finalPrice = discountPrice(price, percent);
  return `Final price: ${formatMoney(finalPrice)}\nYou save: ${formatMoney(price - finalPrice)}\nDiscount: ${formatNumber(percent)}%`;
}

function buildLoanOutput(principalInput: string, rateInput: string, yearsInput: string, paymentsInput: string): string {
  const principal = readNumber(principalInput, 'Principal');
  const annualRate = readNumber(rateInput, 'Annual rate');
  const years = readNumber(yearsInput, 'Years');
  const paymentsPerYear = readNumber(paymentsInput, 'Payments per year');
  const payment = loanPayment(principal, annualRate, years, paymentsPerYear);
  const totalPaid = payment * years * paymentsPerYear;
  return `Payment per period: ${formatMoney(payment)}\nTotal paid: ${formatMoney(totalPaid)}\nTotal interest: ${formatMoney(totalPaid - principal)}`;
}

function buildCompoundOutput(principalInput: string, rateInput: string, yearsInput: string, compoundsInput: string): string {
  const principal = readNumber(principalInput, 'Principal');
  const annualRate = readNumber(rateInput, 'Annual rate');
  const years = readNumber(yearsInput, 'Years');
  const compoundsPerYear = readNumber(compoundsInput, 'Compounds per year');
  const amount = compoundInterest(principal, annualRate, years, compoundsPerYear);
  return `Final amount: ${formatMoney(amount)}\nInterest earned: ${formatMoney(amount - principal)}`;
}

function readNumber(input: string, label: string): number {
  if (input.trim() === '') throw new RangeError(`${label} must be a finite number.`);
  const value = Number(input);
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be a finite number.`);
  return value;
}

function readInteger(input: string, label: string): number {
  const value = readNumber(input, label);
  if (!Number.isInteger(value)) throw new RangeError(`${label} must be an integer.`);
  return value;
}

function formatMoney(value: number): string {
  return value.toFixed(2);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(6).replace(/\.?0+$/, '');
}
