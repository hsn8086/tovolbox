export function percentageOf(value: number, total: number): number {
  assertFiniteNumber(value, 'Value');
  assertFiniteNumber(total, 'Total');

  if (total === 0) {
    throw new RangeError('Total must not be zero.');
  }

  return (value / total) * 100;
}

export function percentageChange(previousValue: number, currentValue: number): number {
  assertFiniteNumber(previousValue, 'Previous value');
  assertFiniteNumber(currentValue, 'Current value');

  if (previousValue === 0) {
    throw new RangeError('Previous value must not be zero.');
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function discountPrice(price: number, discountPercent: number): number {
  assertNonNegativeFiniteNumber(price, 'Price');
  assertPercentage(discountPercent, 'Discount percent');

  return price * (1 - discountPercent / 100);
}

export function loanPayment(
  principal: number,
  annualRatePercent: number,
  years: number,
  paymentsPerYear = 12,
): number {
  assertNonNegativeFiniteNumber(principal, 'Principal');
  assertNonNegativeFiniteNumber(annualRatePercent, 'Annual rate percent');
  assertPositiveFiniteNumber(years, 'Years');
  assertPositiveInteger(paymentsPerYear, 'Payments per year');

  const numberOfPayments = years * paymentsPerYear;
  const ratePerPayment = annualRatePercent / 100 / paymentsPerYear;

  if (!Number.isInteger(numberOfPayments)) {
    throw new RangeError('Total number of payments must be an integer.');
  }

  if (principal === 0) {
    return 0;
  }

  if (ratePerPayment === 0) {
    return principal / numberOfPayments;
  }

  const growth = (1 + ratePerPayment) ** numberOfPayments;
  return (principal * ratePerPayment * growth) / (growth - 1);
}

export function compoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear = 12,
): number {
  assertNonNegativeFiniteNumber(principal, 'Principal');
  assertFiniteNumber(annualRatePercent, 'Annual rate percent');
  assertNonNegativeFiniteNumber(years, 'Years');
  assertPositiveInteger(compoundsPerYear, 'Compounds per year');

  const ratePerCompound = annualRatePercent / 100 / compoundsPerYear;
  if (ratePerCompound <= -1) {
    throw new RangeError('Rate per compound period must be greater than -100%.');
  }

  return principal * (1 + ratePerCompound) ** (compoundsPerYear * years);
}

export function convertNumberBase(value: string, fromBase: number, toBase: number): string {
  assertBase(fromBase, 'From base');
  assertBase(toBase, 'To base');

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new RangeError('Value must not be empty.');
  }

  const sign = trimmed.startsWith('-') ? -1n : 1n;
  const digits = sign === -1n ? trimmed.slice(1) : trimmed;

  if (digits.length === 0) {
    throw new RangeError('Value must contain digits.');
  }

  let decimalValue = 0n;
  for (const digit of digits.toLowerCase()) {
    const numericDigit = parseDigit(digit);
    if (numericDigit >= fromBase) {
      throw new RangeError(`Digit '${digit}' is invalid for base ${fromBase}.`);
    }
    decimalValue = decimalValue * BigInt(fromBase) + BigInt(numericDigit);
  }

  decimalValue *= sign;
  return decimalValue.toString(toBase).toUpperCase();
}

function parseDigit(digit: string): number {
  const codePoint = digit.codePointAt(0);
  if (codePoint === undefined) {
    throw new RangeError('Digit must not be empty.');
  }

  if (codePoint >= 48 && codePoint <= 57) {
    return codePoint - 48;
  }

  if (codePoint >= 97 && codePoint <= 122) {
    return codePoint - 87;
  }

  throw new RangeError(`Invalid digit '${digit}'.`);
}

function assertBase(base: number, label: string): void {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new RangeError(`${label} must be an integer between 2 and 36.`);
  }
}

function assertPercentage(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value < 0 || value > 100) {
    throw new RangeError(`${label} must be between 0 and 100.`);
  }
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive integer.`);
  }
}

function assertPositiveFiniteNumber(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }
}

function assertNonNegativeFiniteNumber(value: number, label: string): void {
  assertFiniteNumber(value, label);
  if (value < 0) {
    throw new RangeError(`${label} must not be negative.`);
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number.`);
  }
}
