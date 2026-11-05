export function PortalArt() {
  return (
    <svg className="era-portal-art" viewBox="0 0 80 80" aria-hidden="true">
      <rect x="3" y="3" width="74" height="74" rx="18" fill="#263e30" />
      <g fill="#e8c47b" stroke="#f8dda2" strokeWidth="2">
        <path d="M10 68V27h16v41M54 68V27h16v41M8 27l10-15 10 15M52 27l10-15 10 15M26 32h28v12H26" />
        <path d="M26 68V51a14 14 0 0128 0v17h-6V51a8 8 0 00-16 0v17z" />
      </g>
      <path d="M14 36h8m36 0h8M14 47h8m36 0h8" stroke="#263e30" strokeWidth="3" />
      <path d="M35 73l5-15 5 15" fill="#b7d884" />
    </svg>
  );
}

export default function EraPortal({ points = 0, count = 0 }) {
  if (!count && !points) return null;
  const label = `${count} ${count === 1 ? 'nova era' : 'novas eras'} · ${points.toLocaleString('pt-BR')} Pórticos de Joinville`;
  return (
    <span className="era-portal-badge" tabIndex={0} data-tooltip={label} aria-label={label}>
      <PortalArt /><span>{points.toLocaleString('pt-BR')}</span><small>↻{count}</small>
    </span>
  );
}
