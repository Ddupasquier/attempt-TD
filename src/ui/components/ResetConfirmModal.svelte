<script lang="ts">
  import Modal from "./Modal.svelte";
  import { UI_TEXT } from "../text";
  import type { ResetConfirmModalProps } from "../../types/ui/components/ResetConfirmModal.types";

  const { isOpen, onConfirm, onCancel } = $props<ResetConfirmModalProps>();
</script>

<Modal isOpen={isOpen} titleId="resetTitle">
  {#snippet title()}
    <span>{UI_TEXT.resetConfirmTitle}</span>
  {/snippet}
  {#snippet message()}
    <span>{UI_TEXT.resetConfirmMessage}</span>
  {/snippet}
  {#snippet actions()}
    <button type="button" onclick={onConfirm}>{UI_TEXT.resetConfirmConfirm}</button>
    <button type="button" onclick={onCancel}>{UI_TEXT.resetConfirmCancel}</button>
  {/snippet}
</Modal>
