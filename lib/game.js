import { STORY_CHAPTERS } from './story.js';

export const CLICK_VALUE = 1;
export const MAX_OFFLINE_SECONDS = 60 * 60 * 8;
export const PRESTIGE_REQUIREMENT = 250_000;
export const COST_GROWTH = 1.15;
export const STORY_MEMORY_BONUS = 0.02;

export const GENERATORS = [
  { id: 'fritz-jr', name: 'Rua das Palmeiras', icon: '🌴', place: 'O cartão-postal da cidade', baseCost: 15, cps: 0.2 },
  { id: 'fritz-worker', name: 'Museu da Imigração', icon: '🏛️', place: 'Museu Nacional de Imigração e Colonização', baseCost: 100, cps: 1 },
  { id: 'fritz-factory', name: 'Mirante Boa Vista', icon: '⛰️', place: 'Morro da Boa Vista', baseCost: 1100, cps: 8 },
  { id: 'fritz-lab', name: 'Estação da Memória', icon: '🚂', place: 'História que move Joinville', baseCost: 12000, cps: 47 },
  { id: 'bolshoi', name: 'Palco do Bolshoi', icon: '🩰', place: 'Escola do Teatro Bolshoi no Brasil', baseCost: 110000, cps: 260 },
  { id: 'zoobotanico', name: 'Parque Zoobotânico', icon: '🦜', place: 'Natureza viva no coração da cidade', baseCost: 1_100_000, cps: 1400 },
  { id: 'expoville', name: 'Festa das Flores', icon: '🌺', place: 'A tradição florida de Joinville', baseCost: 8_000_000, cps: 7800 },
];

export const UPGRADES = [
  { id: 'passos-de-palmeira', name: 'Passos de palmeira', icon: '👣', description: 'Toques valem +50% por nível.', baseCost: 120, clickBonus: 0.5 },
  { id: 'mapa-da-cidade', name: 'Mapa afetivo', icon: '🗺️', description: 'Todos os lugares produzem +20% por nível.', baseCost: 400, productionBonus: 0.2 },
  { id: 'bandana-do-fritz', name: 'Bandana do Fritz', icon: '🧣', description: 'Toques rendem +1 pétala por nível.', baseCost: 950, clickFlat: 1 },
  { id: 'brisa-da-babitonga', name: 'Brisa da Babitonga', icon: '🌬️', description: 'Ganhe +1 hora de progresso offline por nível.', baseCost: 3000, offlineBonus: 3600 },
];

export const CHARACTERS = [
  { id: 'fritz', name: 'Fritz', role: 'O guardião da Cidade das Flores', icon: '🐊', color: 'mint', at: 0, story: 'Uma ventania espalhou as pétalas mágicas de Joinville. Com a cidade ainda adormecida, Fritz parte para encontrar a primeira flor e reacender a alegria das ruas.' },
  { id: 'francisca', name: 'Dona Francisca', role: 'A princesa que inspira o nome da colônia', icon: '👑', color: 'rose', at: 100, story: 'Nas trilhas do palácio, Dona Francisca deixa uma pista sobre as origens da cidade. Cada pétala recuperada ilumina um pedaço da memória de Joinville.' },
  { id: 'fritz-alt', name: 'Fritz Alt', role: 'Escultor que deixou sua marca em Joinville', icon: '🗿', color: 'clay', at: 800, story: 'Entre esculturas e histórias, Fritz Alt ajuda a dar forma à lembrança. O caminho ganha corpo — e o próximo sinal brilha no alto do Boa Vista.' },
  { id: 'juarez-machado', name: 'Juarez Machado', role: 'Artista joinvilense de projeção internacional', icon: '🎨', color: 'sun', at: 6000, story: 'Com cor e imaginação, Juarez revela novas rotas pela cidade. Uma melodia atravessa os jardins e chama o grupo para o próximo encontro.' },
  { id: 'schwanke', name: 'Luiz Henrique Schwanke', role: 'Artista visual nascido em Joinville', icon: '💡', color: 'lilac', at: 40000, story: 'Schwanke transforma luz em pista. Ao seguir seu brilho pela cidade, Fritz encontra a batida que faltava para reunir todas as pétalas.' },
  { id: 'eduarda-henklein', name: 'Eduarda Henklein', role: 'Baterista joinvilense que inspira novas gerações', icon: '🥁', color: 'ocean', at: 240000, story: 'A batida de Eduarda ecoa por Joinville e guia a equipe na última etapa. A cidade floresce novamente: a jornada continua, agora com ainda mais força.' },
];

export const ACHIEVEMENTS = [
  { id: 'first-click', name: 'Primeiro encontro', description: 'Dê seu primeiro toque em Joinville.', icon: '✨', check: (s) => s.totalClicks >= 1 },
  { id: 'first-place', name: 'Portas abertas', description: 'Ative seu primeiro ponto da cidade.', icon: '🚪', check: (s) => s.generators.some((g) => g.owned > 0) },
  { id: 'three-places', name: 'Roteiro completo', description: 'Tenha 3 pontos de Joinville produzindo.', icon: '🧭', check: (s) => s.generators.filter((g) => g.owned > 0).length >= 3 },
  { id: 'thousand', name: 'Cidade das Flores', description: 'Recupere 1.000 pétalas no total.', icon: '🌷', check: (s) => s.lifetime >= 1000 },
  { id: 'friends', name: 'Gente que inspira', description: 'Reúna 4 personalidades na jornada.', icon: '🤝', check: (s) => s.characters.filter((c) => c.unlocked).length >= 4 },
  { id: 'prestige', name: 'Novas raízes', description: 'Plante sua primeira Semente da Cidade.', icon: '🌱', check: (s) => s.seeds > 0 },
  { id: 'story-reader', name: 'Memória viva', description: 'Guarde o primeiro capítulo no seu diário.', icon: '📖', check: (s) => s.storyMemories >= 1 },
];

export function generatorCost(generator, owned) {
  return Math.ceil(generator.baseCost * Math.pow(COST_GROWTH, owned));
}

export function newPlayer(now = Date.now()) {
  return {
    coins: 0, total_clicks: 0, last_update: now, lifetime: 0,
    seeds: 0, last_daily: 0, generators: {}, upgrades: {}, memories: [],
  };
}

export function coinsPerSecond(ownedMap, multiplier = 1) {
  return GENERATORS.reduce((sum, generator) => sum + (ownedMap[generator.id] ?? 0) * generator.cps, 0) * multiplier;
}

function getBonuses(upgradeMap, seeds, characterCount) {
  return UPGRADES.reduce(
    (bonuses, upgrade) => {
      const levels = upgradeMap[upgrade.id] ?? 0;
      bonuses.clickBonus += (upgrade.clickBonus ?? 0) * levels;
      bonuses.clickFlat += (upgrade.clickFlat ?? 0) * levels;
      bonuses.productionBonus += (upgrade.productionBonus ?? 0) * levels;
      bonuses.offlineBonus += (upgrade.offlineBonus ?? 0) * levels;
      return bonuses;
    },
    {
      clickBonus: 0,
      clickFlat: 0,
      productionBonus: (seeds * 0.25) + (characterCount * 0.05),
      offlineBonus: 0,
    }
  );
}

function dailyReward(cps) {
  return Math.max(100, Math.floor(250 + cps * 60));
}

function playerBonuses(player) {
  const ownedCharacters = CHARACTERS.filter((character) => player.lifetime >= character.at);
  const bonuses = getBonuses(player.upgrades, player.seeds, ownedCharacters.length - 1);
  bonuses.productionBonus += player.memories.length * STORY_MEMORY_BONUS;
  return bonuses;
}

export function tick(player, now) {
  const bonuses = playerBonuses(player);
  const cps = coinsPerSecond(player.generators, 1 + bonuses.productionBonus);
  const maxOfflineSeconds = MAX_OFFLINE_SECONDS + bonuses.offlineBonus;
  const elapsed = Math.min(Math.max((now - player.last_update) / 1000, 0), maxOfflineSeconds);
  const earned = elapsed * cps;

  player.coins += earned;
  player.lifetime += earned;
  player.last_update = now;
  return { earned, elapsed };
}

export function getState(player, now, { earned = 0, elapsed = 0 } = {}) {
  const owned = player.generators;
  const upgradeMap = player.upgrades;
  const memories = new Set(player.memories);
  const characters = CHARACTERS.map((character) => ({
    ...character,
    unlocked: player.lifetime >= character.at,
  }));
  const bonuses = playerBonuses(player);
  const cps = coinsPerSecond(owned, 1 + bonuses.productionBonus);
  const achievements = ACHIEVEMENTS.map((achievement) => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    unlocked: achievement.check({
      totalClicks: player.total_clicks,
      lifetime: player.lifetime,
      generators: GENERATORS.map((generator) => ({
        id: generator.id,
        owned: owned[generator.id] ?? 0,
      })),
      characters,
      seeds: player.seeds,
      storyMemories: memories.size,
    }),
  }));
  const nextChapter = characters.find((character) => !character.unlocked) ?? null;
  const dailyAvailable = !player.last_daily || now - player.last_daily >= 24 * 60 * 60 * 1000;

  return {
    coins: player.coins,
    lifetime: player.lifetime,
    totalClicks: player.total_clicks,
    cps,
    clickValue: (CLICK_VALUE + bonuses.clickFlat) * (1 + bonuses.clickBonus),
    lastEarned: earned,
    lastElapsed: elapsed,
    seeds: player.seeds,
    dailyAvailable,
    dailyReward: dailyReward(cps),
    prestigeRequirement: PRESTIGE_REQUIREMENT,
    prestigeReady: player.coins >= PRESTIGE_REQUIREMENT,
    storyMemoryCount: memories.size,
    storyProductionBonus: memories.size * STORY_MEMORY_BONUS,
    storyChapters: STORY_CHAPTERS.map((chapter) => ({
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      at: chapter.at,
      unlocked: player.lifetime >= chapter.at,
      completed: memories.has(chapter.id),
    })),
    characters,
    nextChapter,
    achievements,
    generators: GENERATORS.map((generator) => ({
      ...generator,
      owned: owned[generator.id] ?? 0,
      cost: generatorCost(generator, owned[generator.id] ?? 0),
    })),
    upgrades: UPGRADES.map((upgrade) => {
      const ownedCount = upgradeMap[upgrade.id] ?? 0;
      return {
        ...upgrade,
        owned: ownedCount,
        maxOwned: 5,
        cost: Math.ceil(upgrade.baseCost * Math.pow(2.8, ownedCount)),
      };
    }),
    multipliers: {
      production: 1 + bonuses.productionBonus,
      offlineHours: maxOfflineHours(bonuses.offlineBonus),
    },
  };
}

function maxOfflineHours(bonus) {
  return (MAX_OFFLINE_SECONDS + bonus) / 3600;
}

export function runGameAction(snapshot, action, input = {}, now = Date.now()) {
  const player = structuredClone(snapshot);
  const offline = tick(player, now);
  const state = getState(player, now, offline);
  const extra = {};

  if (action === 'click') {
    player.coins += state.clickValue;
    player.lifetime += state.clickValue;
    player.total_clicks++;
  } else if (action === 'buy') {
    const generator = GENERATORS.find((item) => item.id === input.generatorId);
    if (!generator) return { error: 'Gerador inválido.' };
    const owned = player.generators[generator.id] ?? 0;
    const cost = generatorCost(generator, owned);
    if (!Number.isFinite(cost) || player.coins < cost) return { error: 'Pétalas insuficientes.' };
    player.coins -= cost;
    player.generators[generator.id] = owned + 1;
  } else if (action === 'upgrade') {
    const upgrade = state.upgrades.find((item) => item.id === input.upgradeId);
    if (!upgrade) return { error: 'Melhoria inválida.' };
    if (upgrade.owned >= upgrade.maxOwned) return { error: 'Esta melhoria já atingiu o nível máximo.' };
    if (player.coins < upgrade.cost) return { error: 'Pétalas insuficientes.' };
    player.coins -= upgrade.cost;
    player.upgrades[upgrade.id] = upgrade.owned + 1;
  } else if (action === 'daily') {
    if (!state.dailyAvailable) return { error: 'O presente de hoje já foi resgatado. Volte amanhã!' };
    player.coins += state.dailyReward;
    player.lifetime += state.dailyReward;
    player.last_daily = now;
  } else if (action === 'prestige') {
    if (!state.prestigeReady) return { error: 'Reúna 250.000 pétalas para plantar novas raízes.' };
    extra.prestigeAward = Math.floor(player.coins / PRESTIGE_REQUIREMENT);
    player.seeds += extra.prestigeAward;
    player.coins = 0;
    player.generators = {};
    player.upgrades = {};
  } else if (action === 'story') {
    const chapter = state.storyChapters.find((item) => item.id === input.chapterId);
    if (!chapter) return { error: 'Capítulo inválido.' };
    if (!chapter.unlocked) return { error: 'Este capítulo ainda não foi descoberto.' };
    if (chapter.completed) return { error: 'Esta lembrança já está guardada.' };
    extra.memoryReward = Math.max(150, Math.ceil(150 + state.cps * 60));
    player.memories.push(chapter.id);
    player.coins += extra.memoryReward;
    player.lifetime += extra.memoryReward;
  } else if (action !== 'game') {
    return { error: 'Ação inválida.' };
  }

  return { player, state: { ...getState(player, now, offline), ...extra } };
}
