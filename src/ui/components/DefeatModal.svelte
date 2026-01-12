<script lang="ts">
  import Modal from "./Modal.svelte";
  import { UI_TEXT } from "../text";

  const { isOpen, onReset } = $props();
</script>

<Modal isOpen={isOpen} titleId="defeatTitle">
  <span slot="title">{UI_TEXT.defeatTitle}</span>
  <span slot="message">{UI_TEXT.defeatMessage}</span>
  <button slot="actions" type="button" onclick={onReset}>{UI_TEXT.defeatReset}</button>
</Modal>
