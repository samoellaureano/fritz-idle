import GameIcon from '@/app/components/GameIcon';
import { MUSEUM_ITEMS } from '@/lib/progression';
import { MUSEUM_ART } from '@/lib/icon-art';

export default function MuseumBadges({ items = [] }) {
  const ids = items.map((item) => typeof item === 'string' ? item : item.owned ? item.id : null);
  return (
    <span className="museum-badges" aria-label="Insígnias do museu">
      {MUSEUM_ITEMS.filter((item) => ids.includes(item.id)).map((item) => (
        <span className="museum-badge" key={item.id} tabIndex={0} data-tooltip={item.name} aria-label={item.name}><GameIcon name={MUSEUM_ART[item.id]} /></span>
      ))}
    </span>
  );
}
