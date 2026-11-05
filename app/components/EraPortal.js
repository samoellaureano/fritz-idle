import GameIcon from './GameIcon';

export function PortalArt() {
  return <GameIcon name="portal" className="era-portal-art" />;
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
