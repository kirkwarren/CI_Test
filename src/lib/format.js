export function money(n, { compact = false } = {}) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...(compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}),
  }).format(n);
}

export function pct(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `${(n * 100).toFixed(digits)}%`;
}

export function num(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}
