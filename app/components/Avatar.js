import { avatarFor } from '@/lib/community';
import { PORTRAIT_ART } from '@/lib/icon-art';

export default function Avatar({ id, decorative = false }) {
  const avatar = avatarFor(id);
  if (!avatar) return null;
  return <img className="player-avatar" src={`/icons/${PORTRAIT_ART[id]}.webp`}
    alt={decorative ? '' : `Avatar lúdico: ${avatar.name}`} aria-hidden={decorative || undefined}
    width="100" height="100" decoding="async" />;
}
