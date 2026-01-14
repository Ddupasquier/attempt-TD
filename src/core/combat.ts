import type { DamageGroup, DamageGroupResistances, DamageResistances, DamageType } from "../types/core/types";

const DAMAGE_TYPE_GROUPS: Record<DamageType, DamageGroup> = {
  bludgeoning: "physical",
  piercing: "physical",
  slashing: "physical",
  acid: "magical",
  cold: "magical",
  fire: "magical",
  force: "magical",
  lightning: "magical",
  necrotic: "magical",
  poison: "magical",
  psychic: "magical",
  radiant: "magical",
  thunder: "magical",
};

const getDamageMultiplier = (
  damageType: DamageType | undefined,
  resistances?: DamageResistances,
  groupResistances?: DamageGroupResistances,
) => {
  if (!damageType) return 1;
  const group = DAMAGE_TYPE_GROUPS[damageType];
  const groupMult = groupResistances?.[group] ?? 1;
  const typeMult = resistances?.[damageType] ?? 1;
  return groupMult * typeMult;
};

const applyDamageModifiers = (
  baseDamage: number,
  damageType: DamageType | undefined,
  resistances?: DamageResistances,
  groupResistances?: DamageGroupResistances,
) => {
  if (baseDamage <= 0) return 0;
  const multiplier = getDamageMultiplier(damageType, resistances, groupResistances);
  return Math.max(0, baseDamage * multiplier);
};

export { DAMAGE_TYPE_GROUPS, applyDamageModifiers, getDamageMultiplier };
