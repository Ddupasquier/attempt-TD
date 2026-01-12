import { writable, type Writable } from "svelte/store";
import type { UiState } from "../types/ui/uiStateTypes";

const createUiState = (initial: UiState): Writable<UiState> => writable(initial);

export { createUiState };
