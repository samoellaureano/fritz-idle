import test from 'node:test';
import assert from 'node:assert/strict';
import { generatorCost, generatorPurchase } from '../lib/purchases.js';
import { GENERATORS, newPlayer, runGameAction } from '../lib/game.js';

test('max preview matches actual purchases at rounded boundaries for every place and existing ownership', () => {
  for (const generator of GENERATORS) {
    for (const owned of [0, 7, 25]) {
      for (const quantity of [1, 2, 3, 4, 20]) {
        const cost = Array.from({ length: quantity }, (_, index) => generatorCost(generator, owned + index))
          .reduce((sum, value) => sum + value, 0);
        for (const balance of [cost - 1, cost, cost + .5]) {
          const preview = generatorPurchase(generator, owned, balance);
          assert.equal(preview.quantity, balance < cost ? quantity - 1 : quantity);
          if (!preview.quantity) continue;
          const player = { ...newPlayer(1000), coins: balance, generators: { [generator.id]: owned } };
          const result = runGameAction(player, 'buy', { generatorId: generator.id, quantity: 'max' }, 1000);
          assert.ok(!result.error);
          assert.equal(result.player.generators[generator.id] - owned, preview.quantity);
          assert.equal(result.player.coins, preview.remaining);
          assert.ok(preview.remaining < generatorCost(generator, owned + preview.quantity));
        }
      }
    }
  }
});

test('preview handles zero balance, single purchases and exhausted finite generator costs', () => {
  const generator = GENERATORS[0];
  assert.deepEqual(generatorPurchase(generator, 0, 0), { quantity: 0, remaining: 0 });
  assert.deepEqual(generatorPurchase(generator, 0, 100, false), { quantity: 1, remaining: 85 });
  assert.deepEqual(generatorPurchase(generator, 10000, 100), { quantity: 0, remaining: 100 });
});
