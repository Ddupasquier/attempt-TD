/// <reference types="svelte" />
/// <reference types="svelte/ambient" />
/// <reference types="svelte/types" />

declare module "*.svelte" {
  import type { SvelteComponent } from "svelte";
  export default class Component extends SvelteComponent {}
}
