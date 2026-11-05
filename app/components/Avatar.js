import { avatarFor } from '@/lib/community';

const palettes = {
  fritz: ['#294e3e', '#b7d884', '#e7cc88'],
  francisca: ['#654551', '#f0d7b3', '#ddaa76'],
  'fritz-alt': ['#51443a', '#dabb96', '#c4b5a3'],
  'juarez-machado': ['#3d5267', '#ddb38c', '#d19a56'],
  schwanke: ['#4d4569', '#e3bba0', '#afa7cc'],
};

export default function Avatar({ id, decorative = false }) {
  const avatar = avatarFor(id);
  if (!avatar) return null;
  const [background, skin, accent] = palettes[id];
  return (
    <svg className="player-avatar" viewBox="0 0 100 100" role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `Avatar lúdico: ${avatar.name}`}>
      <circle cx="50" cy="50" r="48" fill={background} stroke={accent} strokeWidth="2" />
      <path d="M12 82Q50 56 88 82V94H12Z" fill={accent} />
      {id === 'fritz' ? (
        <g>
          <path d="M25 67V37Q25 23 37 26Q47 15 57 29Q73 25 75 43L84 54Q89 66 73 70Z" fill={skin} />
          <circle cx="39" cy="34" r="7" fill="#f7edd1" /><circle cx="56" cy="34" r="7" fill="#f7edd1" />
          <circle cx="41" cy="34" r="3" fill="#243b2b" /><circle cx="58" cy="34" r="3" fill="#243b2b" />
          <path d="M40 57Q59 68 78 57" fill="none" stroke="#355331" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 69L72 72L67 81L28 79Z" fill="#d77d65" />
        </g>
      ) : (
        <g>
          <path d="M28 52Q18 19 50 17Q82 20 73 56L64 63H35Z" fill={id === 'fritz-alt' ? '#bcb4a6' : '#332f2c'} />
          <path d="M43 63H57V78H43Z" fill={skin} />
          <ellipse cx="50" cy="46" rx="21" ry="25" fill={skin} />
          <path d="M29 36Q32 17 51 20Q69 17 72 36Q59 27 48 30Q38 38 29 36" fill={id === 'fritz-alt' ? '#bcb4a6' : '#332f2c'} />
          <path d="M37 45H43M57 45H63" stroke="#3b3632" strokeWidth="3" strokeLinecap="round" />
          <path d="M46 59Q50 62 55 58" stroke="#985e50" strokeWidth="2" fill="none" strokeLinecap="round" />
          {id === 'francisca' && <g><path d="M30 25L28 12L42 19L50 8L58 19L72 12L70 25Z" fill="#e6c46e" /><circle cx="50" cy="20" r="3" fill="#a45863" /><path d="M34 79L50 91L66 79" fill="none" stroke="#f4e3bf" strokeWidth="4" /></g>}
          {id === 'fritz-alt' && <g><path d="M29 29Q31 12 52 13Q74 12 76 29Z" fill="#ac7854" /><path d="M25 30H77" stroke="#7d513e" strokeWidth="5" /><path d="M37 58Q50 52 63 58L60 63L50 60L40 63Z" fill="#bcb4a6" /><path d="M71 79L80 65L86 69L77 84Z" fill="#e9ddc9" /></g>}
          {id === 'juarez-machado' && <g><path d="M25 28Q27 14 48 15L70 20L75 30Z" fill="#ba6958" /><path d="M39 57Q50 51 61 57L58 62L50 59L42 62Z" fill="#49352d" /><ellipse cx="76" cy="81" rx="13" ry="9" fill="#d6b77d" /><circle cx="71" cy="78" r="3" fill="#cc675b" /><circle cx="80" cy="82" r="3" fill="#7998b9" /></g>}
          {id === 'schwanke' && <g><rect x="33" y="39" width="15" height="13" rx="4" fill="none" stroke="#4b414d" strokeWidth="2" /><rect x="53" y="39" width="15" height="13" rx="4" fill="none" stroke="#4b414d" strokeWidth="2" /><path d="M48 44H53M74 14V24M69 19H79" stroke="#e9d596" strokeWidth="2" /><path d="M44 76L50 89L56 76" fill="#e4d7ae" /></g>}
        </g>
      )}
      <path d="M15 72Q7 60 15 48M16 62L23 56M14 56L9 52" stroke={accent} strokeWidth="2" fill="none" opacity=".7" />
    </svg>
  );
}
