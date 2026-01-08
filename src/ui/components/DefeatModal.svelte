<script lang="ts">
  import { UI_TEXT } from "../text";

  const { isOpen, onReset } = $props();
</script>

<div class="modal" class:open={isOpen} aria-hidden={isOpen ? "false" : "true"}>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="defeatTitle">
    <h2 id="defeatTitle">{UI_TEXT.defeatTitle}</h2>
    <p>{UI_TEXT.defeatMessage}</p>
    <!-- svelte-ignore event_directive_deprecated -->
    <button type="button" on:click={onReset}>{UI_TEXT.defeatReset}</button>
  </div>
</div>
