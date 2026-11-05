export const SYMBOL_ART = {
  '🐊': 'fritz', '👑': 'francisca', '🗿': 'sculpture', '🎨': 'palette',
  '💡': 'lantern', '🥁': 'drum', '🌸': 'petal', '🌱': 'seed', '🏰': 'portal',
  '🌷': 'flower', '🌼': 'flower', '🌺': 'flower', '📖': 'diary', '📚': 'diary',
  '📒': 'diary', '🗺️': 'map', '🧭': 'map', '👣': 'boots', '🧣': 'scarf',
  '☔': 'umbrella', '🧺': 'basket', '🔔': 'bell', '☕': 'coffee',
  '🚿': 'watering-can', '🚲': 'bicycle', '🧵': 'loom', '⚙️': 'gear',
  '🏭': 'workshop', '❄️': 'fridge', '🔩': 'bolt', '🎡': 'memory-wheel',
  '🩰': 'ballet', '🦜': 'bird', '🌴': 'palms', '⛰️': 'lookout',
  '☀️': 'sun', '🌬️': 'sun', '✨': 'lantern', '🤝': 'friends', '🚪': 'door',
  '🔒': 'lock', '🎁': 'gift', '💚': 'heart', '🚂': 'train', '🏛️': 'museum',
  '💌': 'diary', '📍': 'map', '⛪': 'cathedral', '🛍️': 'market',
  '⛵': 'boat', '🐚': 'sambaqui', '🎼': 'lyre', '🌳': 'memory-house',
  '🖼️': 'frame', '🏘️': 'door', '🥟': 'pie',
};

export const PORTRAIT_ART = {
  fritz: 'fritz', francisca: 'francisca', 'fritz-alt': 'fritz-alt',
  'juarez-machado': 'juarez-machado', schwanke: 'schwanke',
  'eduarda-henklein': 'eduarda-henklein',
};

export const MUSEUM_ART = {
  'roda-da-memoria': 'memory-wheel', bicicleta: 'bicycle', dohler: 'loom',
  wetzel: 'gear', tupy: 'diary', consul: 'fridge', ciser: 'bolt',
};

export const JOURNEY_ICON_ART = {
  flores: 'flower', bicicletas: 'bicycle', industria: 'workshop',
  'palmeiras-imigracao': 'palms', catedral: 'cathedral', 'mercado-publico': 'market',
  'monumento-barca': 'boat', sambaqui: 'sambaqui', 'escola-bolshoi': 'ballet',
  'o-farol': 'lantern', 'empadas-jerke': 'pie', 'instituto-juarez': 'butterfly',
  'museu-arte': 'frame', 'cemiterio-imigrantes': 'memory-house',
  'harmonia-lyra': 'lyre', 'deutsche-schule': 'school', 'opa-jerke': 'door',
};

export function iconSource(symbol) {
  const name = SYMBOL_ART[symbol];
  if (!name) throw new Error(`Ilustração não cadastrada para o ícone: ${symbol}`);
  return `/icons/${name}.webp`;
}
