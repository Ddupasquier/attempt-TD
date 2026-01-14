import type { Defense, DefenseAuraBonuses } from "../types/core/types";

const getDefenseAuraMultipliers = (defense: Defense, defenses: Defense[]) => {
  let damageMult = 1;
  let rangeMult = 1;
  let rateMult = 1;
  const falloffSteps = [1, 0.5, 0.25, 0.125];
  const auraBonusesList: DefenseAuraBonuses[] = [];

  for (const source of defenses) {
    const auraRange = source.type.auraRangeTiles;
    const auraBonuses = source.type.auraBonuses;
    if (!auraRange || !auraBonuses) continue;
    const dist = Math.hypot(defense.col - source.col, defense.row - source.row);
    if (dist > auraRange) continue;
    auraBonusesList.push(auraBonuses);
  }

  if (auraBonusesList.length > 0) {
    auraBonusesList.sort((a, b) => {
      const aScore = (a.damageMult - 1) + (a.rangeMult - 1) + (1 - a.rateMult);
      const bScore = (b.damageMult - 1) + (b.rangeMult - 1) + (1 - b.rateMult);
      return bScore - aScore;
    });
    for (let i = 0; i < auraBonusesList.length; i += 1) {
      const weight = falloffSteps[i] ?? falloffSteps[falloffSteps.length - 1] * 0.5 ** (i - falloffSteps.length + 1);
      const bonus = auraBonusesList[i];
      damageMult += (bonus.damageMult - 1) * weight;
      rangeMult += (bonus.rangeMult - 1) * weight;
      rateMult -= (1 - bonus.rateMult) * weight;
    }
    damageMult = Math.max(0.5, damageMult);
    rangeMult = Math.max(0.5, rangeMult);
    rateMult = Math.min(1, Math.max(0.5, rateMult));
  }

  return { damageMult, rangeMult, rateMult };
};

const applyAuraToStats = (
  stats: {
    damage: number;
    range: number;
    rate: number;
    critChance: number;
    critMultiplier: number;
    knockback: number;
  },
  aura: DefenseAuraBonuses,
) => ({
  ...stats,
  damage: stats.damage * aura.damageMult,
  range: stats.range * aura.rangeMult,
  rate: stats.rate * aura.rateMult,
});

export { applyAuraToStats, getDefenseAuraMultipliers };
