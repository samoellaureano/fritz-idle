import { iconSource } from '@/lib/icon-art';

export default function GameIcon({ symbol, name, className = '', label }) {
  return <img className={`game-icon ${className}`} src={name ? `/icons/${name}.webp` : iconSource(symbol)}
    alt={label || ''} aria-hidden={label ? undefined : true} width="32" height="32" decoding="async" />;
}
