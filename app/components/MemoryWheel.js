export function WheelArt() {
  return (
    <svg className="memory-wheel-art" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="32" fill="#263e30" stroke="#f3cb78" strokeWidth="5" />
      <g stroke="#d6af60" strokeWidth="2">
        <path d="M40 9v62M9 40h62M18 18l44 44M18 62l44-44" />
      </g>
      <circle cx="40" cy="40" r="10" fill="#f3cb78" />
      <path d="M40 39c-13-15-21 1 0 11 21-10 13-26 0-11" fill="#b7d884" stroke="#263e30" strokeWidth="2" />
      <path d="M52 12q14-13 18 2-13 10-18-2" fill="#b7d884" />
    </svg>
  );
}

export default function MemoryWheel({ points = 0, count = 0 }) {
  if (!count) return null;
  const label = `${count} ${count === 1 ? 'redefinição' : 'redefinições'} · ${points.toLocaleString('pt-BR')} Rodas da Memória`;
  return (
    <span className="memory-wheel-badge" title={label} aria-label={label}>
      <WheelArt /><span>{points.toLocaleString('pt-BR')}</span><small>↻{count}</small>
    </span>
  );
}
