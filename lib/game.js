import { STORY_CHAPTERS } from './story.js';
import { MUSEUM_ITEMS, rebirthPreview, PORTAL_PRODUCTION_BONUS } from './progression.js';
import { CITY_CHAPTERS, JOURNEYS } from './journeys.js';
import { generatorCost, generatorPurchase } from './purchases.js';
export { COST_GROWTH, generatorCost } from './purchases.js';

export const CLICK_VALUE = 1;
export const MAX_OFFLINE_SECONDS = 60 * 60 * 5;
export const SEED_GENERATOR_REQUIREMENT = 500_000_000;
export const SHARE_COOLDOWN = 24 * 60 * 60 * 1000;
export const SHARE_DURATION = 30 * 60 * 1000;
export const STORY_MEMORY_BONUS = 0.02;

export const GENERATORS = [
  { id: 'fritz-jr', name: 'Rua das Palmeiras', icon: '🌴', place: 'O cartão-postal da cidade', baseCost: 15, cps: 0.2 },
  { id: 'fritz-worker', name: 'Museu da Imigração', icon: '🏛️', place: 'Museu Nacional de Imigração e Colonização', baseCost: 100, cps: 1 },
  { id: 'fritz-factory', name: 'Mirante Boa Vista', icon: '⛰️', place: 'Morro da Boa Vista', baseCost: 1100, cps: 8 },
  { id: 'fritz-lab', name: 'Estação da Memória', icon: '🚂', place: 'Trilhos e o Memorial da Bicicleta', baseCost: 12000, cps: 47 },
  { id: 'bolshoi', name: 'Palco do Bolshoi', icon: '🩰', place: 'Escola do Teatro Bolshoi no Brasil', baseCost: 110000, cps: 260 },
  { id: 'zoobotanico', name: 'Parque Zoobotânico', icon: '🦜', place: 'Natureza viva no coração da cidade', baseCost: 1_100_000, cps: 1400 },
  { id: 'expoville', name: 'Festa das Flores', icon: '🌺', place: 'A tradição florida de Joinville', baseCost: 8_000_000, cps: 7800 },
  { id: 'bicicletas', name: 'Caminhos de bicicleta', icon: '🚲', place: 'Uma homenagem à Cidade das Bicicletas', baseCost: 25_000_000, cps: 22000 },
  { id: 'dohler', name: 'Fios da Döhler', icon: '🧵', place: 'Memória têxtil desde 1881', baseCost: 90_000_000, cps: 72000 },
  { id: 'wetzel', name: 'Ofícios da Wetzel', icon: '⚙️', place: 'Saberes da fundição desde 1932', baseCost: 320_000_000, cps: 230000 },
  { id: 'tupy', name: 'Aprendizes da Tupy', icon: '🏭', place: 'Indústria desde 1938, conhecimento que floresce', baseCost: 1_100_000_000, cps: 740000 },
  { id: 'consul', name: 'Lembranças da Consul', icon: '❄️', place: 'Histórias que chegam às casas desde 1950', baseCost: 4_000_000_000, cps: 2400000 },
  { id: 'ciser', name: 'Conexões da Ciser', icon: '🔩', place: 'Pequenas peças conectando histórias desde 1959', baseCost: 15_000_000_000, cps: 7800000 },
];

export const UPGRADES = [
  { id: 'passos-de-palmeira', name: 'Passos de palmeira', icon: '👣', description: 'Toques valem +50% por nível.', baseCost: 120, clickBonus: 0.5 },
  { id: 'mapa-da-cidade', name: 'Mapa afetivo', icon: '🗺️', description: 'Todos os lugares produzem +20% por nível.', baseCost: 400, productionBonus: 0.2 },
  { id: 'bandana-do-fritz', name: 'Bandana do Fritz', icon: '🧣', description: 'Toques rendem +1 pétala por nível.', baseCost: 950, clickFlat: 1 },
  { id: 'brisa-da-babitonga', name: 'Brisa da Babitonga', icon: '🌬️', description: 'Ganhe +1 hora de progresso offline por nível.', baseCost: 3000, offlineBonus: 3600 },
  { id: 'capa-de-chuva', name: 'Capa de chuva florida', icon: '☔', description: 'Nem a garoa segura Fritz: +2 pétalas por toque a cada nível.', baseCost: 6500, clickFlat: 2 },
  { id: 'cestinha-do-fritz', name: 'Cestinha de descobertas', icon: '🧺', description: 'Sempre cabe mais uma flor: +25% no valor dos toques por nível.', baseCost: 25000, clickBonus: .25 },
  { id: 'campainha-das-flores', name: 'Campainha das flores', icon: '🔔', description: 'Um trim-trim convida a cidade a florescer: +10% de produção dos lugares por nível.', baseCost: 150000, productionBonus: .1 },
  { id: 'garrafa-de-cafe', name: 'Café para o caminho', icon: '☕', description: 'Uma pausa quentinha antes de continuar: +30 minutos de progresso offline por nível.', baseCost: 750000, offlineBonus: 1800 },
  { id: 'regador-de-afetos', name: 'Regador de afetos', icon: '🚿', description: 'Fritz rega cada encontro com carinho: +15% de produção dos lugares por nível.', baseCost: 6000000, productionBonus: .15 },
  { id: 'bolsa-de-sementes', name: 'Bolsa de futuros jardins', icon: '🌱', description: 'Os gestores guardam novos começos: +10% de sementes por nível, com o viveiro ativo.', baseCost: 1000000000, seedBonus: .1 },
];

export const CHARACTERS = [
  { id: 'fritz', name: 'Fritz', role: 'O guardião da Cidade das Flores', icon: '🐊', color: 'mint', at: 0, story: 'Uma ventania espalhou as pétalas mágicas de Joinville. Com a cidade ainda adormecida, Fritz parte para encontrar a primeira flor e reacender a alegria das ruas.' },
  { id: 'francisca', name: 'Dona Francisca', role: 'A princesa que inspira o nome da colônia', icon: '👑', color: 'rose', at: 100, story: 'Nas trilhas do palácio, Dona Francisca deixa uma pista sobre as origens da cidade. Cada pétala recuperada ilumina um pedaço da memória de Joinville.' },
  { id: 'fritz-alt', name: 'Fritz Alt', role: 'Escultor que deixou sua marca em Joinville', icon: '🗿', color: 'clay', at: 800, story: 'Entre esculturas e histórias, Fritz Alt ajuda a dar forma à lembrança. O caminho ganha corpo — e o próximo sinal brilha no alto do Boa Vista.' },
  { id: 'juarez-machado', name: 'Juarez Machado', role: 'Artista joinvilense de projeção internacional', icon: '🎨', color: 'sun', at: 6000, story: 'Com cor e imaginação, Juarez revela novas rotas pela cidade. Uma melodia atravessa os jardins e chama o grupo para o próximo encontro.' },
  { id: 'schwanke', name: 'Luiz Henrique Schwanke', role: 'Artista visual nascido em Joinville', icon: '💡', color: 'lilac', at: 40000, story: 'Schwanke transforma luz em pista. Ao seguir seu brilho pela cidade, Fritz encontra a batida que faltava para reunir todas as pétalas.' },
  { id: 'eduarda-henklein', name: 'Eduarda Henklein', role: 'Baterista joinvilense que inspira novas gerações', icon: '🥁', color: 'ocean', at: 240000, story: 'A batida de Eduarda ecoa por Joinville e guia a equipe na última etapa. A cidade floresce novamente: a jornada continua, agora com ainda mais força.' },
];

export const MANAGERS = CHARACTERS.map((character, index) => ({
  id: character.id, seedCost: [0, 5, 15, 40, 100, 250][index],
  seedsPerSecond: (index + 1) / 60, productionBonus: (index + 1) * .1,
  autoClicks: index * .2,
}));

const STORY_CHAPTERS_WITH_JOURNEYS = [
  ...STORY_CHAPTERS.map((chapter) => ({ ...chapter, journey: 'flores' })),
  ...CITY_CHAPTERS,
];
const PLACE_JOURNEYS = JOURNEYS.filter((journey) => journey.category === 'lugares');

export const ACHIEVEMENTS = [
  { id: 'first-click', name: 'Primeiro encontro', description: 'Dê seu primeiro toque em Joinville.', icon: '✨', check: (s) => s.totalClicks >= 1 },
  { id: 'first-place', name: 'Portas abertas', description: 'Ative seu primeiro lugar produtor de pétalas.', icon: '🚪', check: (s) => s.generators.some((g) => g.owned > 0) },
  { id: 'three-places', name: 'Roteiro completo', description: 'Tenha 3 pontos de Joinville produzindo.', icon: '🧭', check: (s) => s.generators.filter((g) => g.owned > 0).length >= 3 },
  { id: 'thousand', name: 'Primeiras mil pétalas', description: 'Recupere 1.000 pétalas no total.', icon: '🌷', check: (s) => s.lifetime >= 1000 },
  { id: 'friends', name: 'Gente que inspira', description: 'Reúna 4 personalidades na jornada.', icon: '🤝', check: (s) => s.characters.filter((c) => c.unlocked).length >= 4 },
  { id: 'prestige', name: 'Sementes para o futuro', description: 'Produza sua primeira semente da cidade.', icon: '🌱', check: (s) => s.seeds > 0 },
  { id: 'story-reader', name: 'Uma história guardada', description: 'Guarde seu primeiro capítulo em qualquer jornada.', icon: '📖', check: (s) => s.storyMemories >= 1 },
  { id: 'museum', name: 'Guardião do acervo', description: 'Adquira sua primeira peça do museu.', icon: '🏛️', check: (s) => s.museum > 0 },
  { id: 'rebirth', name: 'A cidade segue em frente', description: 'Atravesse o Pórtico de Joinville para uma nova era.', icon: '🏰', check: (s) => s.rebirths > 0 },
  { id: 'flowers-journey', name: 'Oito cores no diário', description: 'Guarde os 8 capítulos da Jornada das Flores.', icon: '🌸', check: (s) => s.completedJourneys.includes('flores') },
  { id: 'bicycles-journey', name: 'Ninguém fica para trás', description: 'Complete os 3 capítulos de Caminhos que aproximam.', icon: '🚲', check: (s) => s.completedJourneys.includes('bicicletas') },
  { id: 'industry-journey', name: 'Mãos que constroem', description: 'Complete os 5 capítulos da jornada dos ofícios.', icon: '🏭', check: (s) => s.completedJourneys.includes('industria') },
  { id: 'first-place-journey', name: 'Histórias em cada lugar', description: 'Complete uma das 14 jornadas dos lugares.', icon: '📍', check: (s) => s.completedPlaceJourneys >= 1 },
  { id: 'five-place-journeys', name: 'Explorador de Joinville', description: 'Complete 5 das 14 jornadas dos lugares.', icon: '🗺️', check: (s) => s.completedPlaceJourneys >= 5 },
  { id: 'all-place-journeys', name: 'Mapa de lembranças', description: `Complete as ${PLACE_JOURNEYS.length} jornadas dos lugares.`, icon: '🏛️', check: (s) => s.completedPlaceJourneys === PLACE_JOURNEYS.length },
  { id: 'all-journeys', name: 'A cidade inteira no diário', description: `Complete as ${JOURNEYS.length} jornadas e guarde os ${STORY_CHAPTERS_WITH_JOURNEYS.length} capítulos.`, icon: '📚', check: (s) => s.completedJourneys.length === JOURNEYS.length },
];

export function newPlayer(now = Date.now()) {
  return {
    coins: 0, total_clicks: 0, last_update: now, lifetime: 0,
    offline_credit_day: new Date(now).toISOString().slice(0, 10), offline_credited_seconds: 0,
    seeds: 0, last_daily: 0, generators: {}, upgrades: {}, memories: [],
    museum: [], porticos: 0, rebirths: 0, cycle_petals: 0, cycle_purchases: 0,
    cycle_stories: 0, cycle_clicks: 0, cycle_museum: 0, managers: [], seed_generator: false,
    achievements: [], last_share: 0, share_until: 0,
  };
}

export function coinsPerSecond(ownedMap, multiplier = 1) {
  return GENERATORS.reduce((sum, generator) => sum + (ownedMap[generator.id] ?? 0) * generator.cps, 0) * multiplier;
}

function getBonuses(upgradeMap, characterCount) {
  return UPGRADES.reduce(
    (bonuses, upgrade) => {
      const levels = upgradeMap[upgrade.id] ?? 0;
      bonuses.clickBonus += (upgrade.clickBonus ?? 0) * levels;
      bonuses.clickFlat += (upgrade.clickFlat ?? 0) * levels;
      bonuses.productionBonus += (upgrade.productionBonus ?? 0) * levels;
      bonuses.offlineBonus += (upgrade.offlineBonus ?? 0) * levels;
      bonuses.seedBonus += (upgrade.seedBonus ?? 0) * levels;
      return bonuses;
    },
    {
      clickBonus: 0,
      clickFlat: 0,
      productionBonus: characterCount * 0.05,
      offlineBonus: 0,
      seedBonus: 0,
    }
  );
}

function dailyReward(cps) {
  return Math.max(100, Math.floor(250 + cps * 60));
}

function playerBonuses(player) {
  const ownedCharacters = CHARACTERS.filter((character) => player.lifetime >= character.at);
  const bonuses = getBonuses(player.upgrades, ownedCharacters.length - 1);
  bonuses.productionBonus += player.memories.length * STORY_MEMORY_BONUS;
  for (const item of MUSEUM_ITEMS) {
    if (player.museum?.includes(item.id)) {
      bonuses.productionBonus += item.productionBonus;
      bonuses.clickFlat += item.clickFlat;
    }
  }
  bonuses.productionBonus += (player.porticos ?? 0) * PORTAL_PRODUCTION_BONUS;
  for (const manager of MANAGERS) {
    if (player.managers?.includes(manager.id)) bonuses.productionBonus += manager.productionBonus;
  }
  return bonuses;
}

function seedRate(player) {
  if (!player.seed_generator) return 0;
  return MANAGERS.filter((manager) => player.managers.includes(manager.id))
    .reduce((sum, manager) => sum + manager.seedsPerSecond, 0)
    * (1 + getBonuses(player.upgrades, 0).seedBonus);
}

function automatedPetals(player, bonuses) {
  const clicks = MANAGERS.filter((manager) => player.managers?.includes(manager.id))
    .reduce((sum, manager) => sum + manager.autoClicks, 0);
  return clicks * (CLICK_VALUE + bonuses.clickFlat) * (1 + bonuses.clickBonus);
}

function earnPetals(player, amount) {
  player.coins += amount;
  player.lifetime += amount;
  player.cycle_petals = (player.cycle_petals ?? 0) + amount;
}

export function tick(player, now, { offline = false } = {}) {
  const bonuses = playerBonuses(player);
  const cps = coinsPerSecond(player.generators, 1 + bonuses.productionBonus) + automatedPetals(player, bonuses);
  const maxOfflineSeconds = MAX_OFFLINE_SECONDS + bonuses.offlineBonus;
  const day = new Date(now).toISOString().slice(0, 10);
  const creditedToday = player.offline_credit_day === day ? player.offline_credited_seconds ?? 0 : 0;
  const offlineRemaining = Math.max(0, maxOfflineSeconds - creditedToday);
  const elapsedLimit = offline ? offlineRemaining : maxOfflineSeconds;
  const elapsed = Math.min(Math.max((now - player.last_update) / 1000, 0), elapsedLimit);
  // Intersect the credited offline interval with the buff, rather than extending it on return.
  const boostedSeconds = Math.max(0, Math.min(now, player.share_until ?? 0) - Math.max(player.last_update, now - elapsed * 1000)) / 1000;
  const earned = (elapsed + boostedSeconds * .2) * cps;
  player.seeds += (elapsed + boostedSeconds * .2) * seedRate(player);

  player.offline_credit_day = day;
  player.offline_credited_seconds = creditedToday + (offline ? elapsed : 0);
  earnPetals(player, earned);
  player.last_update = now;
  return {
    earned,
    elapsed,
    offlineRemainingSeconds: Math.max(0, maxOfflineSeconds - player.offline_credited_seconds),
  };
}

export function getState(player, now, { earned = 0, elapsed = 0 } = {}) {
  const owned = player.generators;
  const upgradeMap = player.upgrades;
  const memories = new Set(player.memories);
  const completedJourneys = JOURNEYS.filter((journey) => (
    STORY_CHAPTERS_WITH_JOURNEYS
      .filter((chapter) => chapter.journey === journey.id)
      .every((chapter) => memories.has(chapter.id))
  )).map((journey) => journey.id);
  const completedPlaceJourneys = completedJourneys.filter((journeyId) => (
    PLACE_JOURNEYS.some((journey) => journey.id === journeyId)
  )).length;
  const characters = CHARACTERS.map((character) => ({
    ...character,
    unlocked: player.lifetime >= character.at,
    ...MANAGERS.find((manager) => manager.id === character.id),
    hired: player.managers?.includes(character.id) ?? false,
  }));
  const bonuses = playerBonuses(player);
  const shareMultiplier = (player.share_until ?? 0) > now ? 1.2 : 1;
  const offlineLimitSeconds = MAX_OFFLINE_SECONDS + bonuses.offlineBonus;
  const offlineCreditedSeconds = player.offline_credit_day === new Date(now).toISOString().slice(0, 10)
    ? player.offline_credited_seconds ?? 0
    : 0;
  const cps = (coinsPerSecond(owned, 1 + bonuses.productionBonus) + automatedPetals(player, bonuses)) * shareMultiplier;
  const achievements = ACHIEVEMENTS.map((achievement) => ({
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    unlocked: player.achievements?.includes(achievement.id) || achievement.check({
      totalClicks: player.total_clicks,
      lifetime: player.lifetime,
      generators: GENERATORS.map((generator) => ({
        id: generator.id,
        owned: owned[generator.id] ?? 0,
      })),
      characters,
      seeds: player.seeds,
      storyMemories: memories.size,
      museum: player.museum?.length ?? 0,
      rebirths: player.rebirths ?? 0,
      completedJourneys,
      completedPlaceJourneys,
    }),
  }));
  const nextChapter = characters.find((character) => !character.unlocked) ?? null;
  const dailyAvailable = !player.last_daily || now - player.last_daily >= 24 * 60 * 60 * 1000;

  return {
    coins: player.coins,
    lifetime: player.lifetime,
    totalClicks: player.total_clicks,
    cps,
    clickValue: (CLICK_VALUE + bonuses.clickFlat) * (1 + bonuses.clickBonus) * shareMultiplier,
    lastEarned: earned,
    lastElapsed: elapsed,
    offlineBudget: {
      limitSeconds: offlineLimitSeconds,
      creditedSeconds: offlineCreditedSeconds,
      remainingSeconds: Math.max(0, offlineLimitSeconds - offlineCreditedSeconds),
      resetsAt: new Date(Date.UTC(
        new Date(now).getUTCFullYear(),
        new Date(now).getUTCMonth(),
        new Date(now).getUTCDate() + 1,
      )).toISOString(),
    },
    seeds: player.seeds,
    seedsPerSecond: seedRate(player) * shareMultiplier,
    seedGenerator: { owned: player.seed_generator, ready: player.cycle_petals >= SEED_GENERATOR_REQUIREMENT,
      cost: SEED_GENERATOR_REQUIREMENT, progress: player.cycle_petals },
    share: { ready: !player.last_share || now - player.last_share >= SHARE_COOLDOWN,
      until: player.share_until, nextAt: player.last_share ? player.last_share + SHARE_COOLDOWN : 0 },
    museum: MUSEUM_ITEMS.map((item) => ({ ...item, owned: player.museum?.includes(item.id) ?? false })),
    rebirth: rebirthPreview(player),
    dailyAvailable,
    dailyReward: dailyReward(cps),
    storyMemoryCount: memories.size,
    storyProductionBonus: memories.size * STORY_MEMORY_BONUS,
    journeys: JOURNEYS,
    storyChapters: [...STORY_CHAPTERS, ...CITY_CHAPTERS].map((chapter) => ({
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      at: chapter.at,
      unlocked: player.lifetime >= chapter.at && (!chapter.previousId || memories.has(chapter.previousId)),
      completed: memories.has(chapter.id),
      journey: chapter.journey ?? 'flores',
    })),
    characters,
    nextChapter,
    achievements,
    generators: GENERATORS.map((generator) => ({
      ...generator,
      effectiveCps: generator.cps * (1 + bonuses.productionBonus) * shareMultiplier,
      journey: generator.id === 'bicicletas' || generator.id === 'fritz-lab' ? 'bicicletas'
        : ['dohler', 'wetzel', 'tupy', 'consul', 'ciser'].includes(generator.id) ? 'industria' : 'flores',
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
      production: (1 + bonuses.productionBonus) * shareMultiplier,
      offlineHours: maxOfflineHours(bonuses.offlineBonus),
    },
  };
}

function maxOfflineHours(bonus) {
  return (MAX_OFFLINE_SECONDS + bonus) / 3600;
}

export function runGameAction(snapshot, action, input = {}, now = Date.now(), { offline = action === 'game' } = {}) {
  const player = structuredClone(snapshot);
  // Preserve legacy rewards; old wheels become portals once, without rewriting historical saves.
  player.museum ??= [];
  player.porticos ??= player.wheels ?? 0;
  delete player.wheels;
  player.rebirths ??= 0;
  delete player.cycle_seeds;
  player.cycle_petals ??= player.lifetime;
  player.cycle_purchases ??= Object.values(player.generators).reduce((sum, owned) => sum + owned, 0);
  player.cycle_stories ??= player.memories.length;
  player.cycle_clicks ??= 0;
  player.cycle_museum ??= 0;
  player.managers ??= [];
  player.seed_generator ??= false;
  player.achievements ??= [];
  player.last_share ??= 0;
  player.share_until ??= 0;
  const tickResult = tick(player, now, { offline });
  const state = getState(player, now, tickResult);
  player.achievements = state.achievements.filter((item) => item.unlocked).map((item) => item.id);
  const extra = {};

  if (action === 'click') {
    earnPetals(player, state.clickValue);
    player.total_clicks++;
    player.cycle_clicks++;
  } else if (action === 'buy') {
    const generator = GENERATORS.find((item) => item.id === input.generatorId);
    if (!generator) return { error: 'Gerador inválido.' };
    const owned = player.generators[generator.id] ?? 0;
    if (input.quantity !== undefined && input.quantity !== 'max') return { error: 'Quantidade inválida.' };
    const { quantity, remaining } = generatorPurchase(generator, owned, player.coins, input.quantity === 'max');
    if (!quantity) return { error: 'Pétalas insuficientes.' };
    player.coins = remaining;
    player.generators[generator.id] = owned + quantity;
    player.cycle_purchases += quantity;
  } else if (action === 'upgrade') {
    const upgrade = state.upgrades.find((item) => item.id === input.upgradeId);
    if (!upgrade) return { error: 'Melhoria inválida.' };
    if (upgrade.owned >= upgrade.maxOwned) return { error: 'Esta melhoria já atingiu o nível máximo.' };
    if (player.coins < upgrade.cost) return { error: 'Pétalas insuficientes.' };
    player.coins -= upgrade.cost;
    player.upgrades[upgrade.id] = upgrade.owned + 1;
  } else if (action === 'daily') {
    if (!state.dailyAvailable) return { error: 'O presente de hoje já foi resgatado. Volte amanhã!' };
    earnPetals(player, state.dailyReward);
    player.last_daily = now;
  } else if (action === 'prestige') {
    return { error: 'As sementes agora são produzidas por gestores. Use o Pórtico no nível 20 para abrir uma era.' };
  } else if (action === 'seed-generator') {
    if (player.seed_generator) return { error: 'O gerador de sementes já foi adquirido.' };
    if (!state.seedGenerator.ready) return { error: 'Recupere 500 milhões de pétalas nesta era para liberar o gerador.' };
    if (player.coins < SEED_GENERATOR_REQUIREMENT) return { error: 'Pétalas insuficientes para o gerador de sementes.' };
    player.coins -= SEED_GENERATOR_REQUIREMENT;
    player.seed_generator = true;
    player.managers.push('fritz');
  } else if (action === 'manager') {
    const character = state.characters.find((entry) => entry.id === input.characterId);
    if (!character) return { error: 'Gestor inválido.' };
    if (!player.seed_generator) return { error: 'Adquira primeiro o gerador de sementes.' };
    if (!character.unlocked) return { error: 'Este personagem ainda não foi encontrado.' };
    if (character.hired) return { error: 'Este gestor já foi contratado.' };
    if (player.seeds < character.seedCost) return { error: 'Sementes insuficientes.' };
    player.seeds -= character.seedCost;
    player.managers.push(character.id);
  } else if (action === 'share') {
    if (!state.share.ready) return { error: 'O bônus de compartilhamento já foi recebido hoje. Volte após 24 horas.' };
    player.last_share = now;
    player.share_until = now + SHARE_DURATION;
  } else if (action === 'museum') {
    const item = MUSEUM_ITEMS.find((entry) => entry.id === input.itemId);
    if (!item) return { error: 'Peça de museu inválida.' };
    if (player.museum.includes(item.id)) return { error: 'Esta peça já está no seu museu.' };
    if (player.porticos < item.cost) return { error: 'Pórticos insuficientes para esta insígnia.' };
    player.porticos -= item.cost;
    player.museum.push(item.id);
    player.cycle_museum++;
  } else if (action === 'rebirth') {
    if (!Number.isSafeInteger(input.expectedCycle) || input.expectedCycle !== player.rebirths) {
      return { error: 'A jornada mudou. Atualize o jogo antes de confirmar a redefinição.' };
    }
    if (!state.rebirth.ready) return { error: 'Atinja o nível 20 de jornada nesta era para atravessar o Pórtico.' };
    extra.rebirthAward = state.rebirth.reward;
    player.porticos += extra.rebirthAward;
    player.rebirths++;
    player.coins = 0;
    player.seeds = 0;
    player.generators = {};
    player.upgrades = {};
    player.cycle_petals = 0;
    player.cycle_purchases = 0;
    player.cycle_stories = 0;
    player.cycle_clicks = 0;
    player.cycle_museum = 0;
    player.managers = [];
    player.seed_generator = false;
  } else if (action === 'story') {
    const chapter = state.storyChapters.find((item) => item.id === input.chapterId);
    if (!chapter) return { error: 'Capítulo inválido.' };
    if (!chapter.unlocked) return { error: 'Este capítulo ainda não foi descoberto.' };
    if (chapter.completed) return { error: 'Esta lembrança já está guardada.' };
    extra.memoryReward = Math.max(150, Math.ceil(150 + state.cps * 60));
    player.memories.push(chapter.id);
    player.cycle_stories++;
    earnPetals(player, extra.memoryReward);
  } else if (action !== 'game') {
    return { error: 'Ação inválida.' };
  }

  const finalState = getState(player, now, tickResult);
  player.achievements = finalState.achievements.filter((item) => item.unlocked).map((item) => item.id);
  return { player, state: { ...finalState, ...extra } };
}
