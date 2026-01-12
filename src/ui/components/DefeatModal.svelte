<script lang="ts">
  import Modal from "./Modal.svelte";
  import { UI_TEXT } from "../text";
  import type { DefeatModalProps } from "../../types/ui/components/DefeatModal.types";

  const { isOpen, onReset } = $props<DefeatModalProps>();
</script>

<Modal isOpen={isOpen} titleId="defeatTitle">
  {#snippet title()}
    <span>{UI_TEXT.defeatTitle}</span>
  {/snippet}
  {#snippet message()}
    <span>{UI_TEXT.defeatMessage}</span>
  {/snippet}
  {#snippet actions()}
    <button type="button" onclick={onReset}>{UI_TEXT.defeatReset}</button>
  {/snippet}
</Modal>
