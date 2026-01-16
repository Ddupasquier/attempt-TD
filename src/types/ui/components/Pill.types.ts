type PillVariant = "env" | "aura" | "lvl" | "base" | "default";
type PillSize = "sm" | "md";

type PillProps = {
  label: string;
  variant?: PillVariant;
  size?: PillSize;
};

export type { PillProps, PillVariant, PillSize };
