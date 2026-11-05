export const AVATARS = [
  { id: 'fritz', name: 'Fritz', role: 'O guardião fictício da Cidade das Flores', art: '/historia-palmeiras.jpg' },
  { id: 'francisca', name: 'Dona Francisca', role: 'A princesa ligada às origens da colônia', art: '/historia-francisca.jpg' },
  { id: 'fritz-alt', name: 'Fritz Alt', role: 'Escultura e memória no Boa Vista', art: '/historia-fritzalt.jpg' },
  { id: 'juarez-machado', name: 'Juarez Machado', role: 'As cores de um artista joinvilense', art: '/historia-juarez.jpg' },
  { id: 'schwanke', name: 'Luiz Henrique Schwanke', role: 'Luz e imaginação na arte de Joinville', art: '/historia-schwanke.jpg' },
];

export const ENCOURAGEMENTS = [
  { id: 'primeira-flor', text: 'Toda grande jornada começa com uma pétala. Continue florescendo!' },
  { id: 'juntos', text: 'Ninguém floresce sozinho. Joinville fica mais bonita com você aqui!' },
  { id: 'recomeco', text: 'Recomeçar também é criar raízes. Sua próxima conquista está chegando!' },
  { id: 'memorias', text: 'Guarde as histórias, cuide das flores e não desista do seu caminho!' },
];

export const MESSAGE_COOLDOWN_SECONDS = 60;
export const MESSAGE_MAX_LENGTH = 160;
export const COMMUNITY_LIMIT = 50;

export function validateProfile(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object'
    || Object.keys(input).length !== 2 || typeof input.nickname !== 'string'
    || typeof input.avatarId !== 'string') {
    return { error: 'Informe seu apelido e escolha um avatar.' };
  }
  const nickname = input.nickname.trim().normalize('NFC');
  if (!/^[\p{L}\p{N}_-]{3,24}$/u.test(nickname)) {
    return { error: 'Use de 3 a 24 letras ou números no apelido. Hífen e sublinhado também são permitidos, mas espaços não.' };
  }
  if (!AVATARS.some((avatar) => avatar.id === input.avatarId)) {
    return { error: 'Escolha um dos avatares de Joinville.' };
  }
  return { nickname, avatarId: input.avatarId };
}

export function validateMessage(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object' || Object.keys(input).length !== 1) {
    return { error: 'Escolha uma mensagem pronta ou escreva seu incentivo.' };
  }
  if (typeof input.presetId === 'string') {
    const preset = ENCOURAGEMENTS.find((item) => item.id === input.presetId);
    return preset ? { text: preset.text } : { error: 'Mensagem pronta inválida.' };
  }
  if (typeof input.text !== 'string') return { error: 'Escreva uma mensagem de encorajamento.' };
  const text = input.text.trim().normalize('NFC');
  if (!text || [...text].length > MESSAGE_MAX_LENGTH || /[\p{Cc}\p{Cf}]/u.test(text)) {
    return { error: 'Escreva de 1 a 160 caracteres, em uma linha e sem caracteres de controle.' };
  }
  return { text };
}

export function avatarFor(id) {
  return AVATARS.find((avatar) => avatar.id === id);
}
