export function formatCompactNumber(value) {
  if (!Number.isFinite(value)) return '0';
  if (Math.abs(value) < 1000) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: Math.abs(value) < 10 ? 1 : 0 });
  }
  const original = value;
  const units = ['mil', 'mi', 'bi', 'tri', 'quad', 'quint', 'sext', 'sept', 'oct', 'non', 'dec'];
  let unitIndex = -1;
  while (Math.abs(value) >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  if (Math.abs(Number(value.toFixed(2))) >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  if (Math.abs(Number(value.toFixed(2))) >= 1000) {
    return original.toLocaleString('pt-BR', { notation: 'scientific', maximumFractionDigits: 2 }).replace('E', 'e');
  }
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
}
