import type { Snippet } from "svelte";

type ModalProps = {
  isOpen: boolean;
  titleId: string;
  title?: Snippet;
  message?: Snippet;
  actions?: Snippet;
};

export type { ModalProps };
