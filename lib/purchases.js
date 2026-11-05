export const COST_GROWTH = 1.15;

export function generatorCost(generator, owned) {
  return Math.ceil(generator.baseCost * Math.pow(COST_GROWTH, owned));
}

export function generatorPurchase(generator, owned, balance, maximum = true) {
  let quantity = 0;
  let remaining = balance;
  do {
    const cost = generatorCost(generator, owned + quantity);
    if (!Number.isFinite(cost) || remaining < cost) break;
    remaining -= cost;
    quantity++;
  } while (maximum);
  return { quantity, remaining };
}
