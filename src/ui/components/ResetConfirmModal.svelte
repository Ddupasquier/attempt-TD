<script lang="ts">
  import Modal from "./Modal.svelte";
  import { UI_TEXT } from "../text";
  import type { ResetConfirmModalProps } from "../../types/ui/components/ResetConfirmModal.types";

  const { isOpen, onConfirm, onCancel } = $props<ResetConfirmModalProps>();
</script>

<Modal isOpen={isOpen} titleId="resetTitle">
  <span slot="title">{UI_TEXT.resetConfirmTitle}</span>
  <span slot="message">{UI_TEXT.resetConfirmMessage}</span>
  <svelte:fragment slot="actions">
    <button type="button" onclick={onConfirm}>{UI_TEXT.resetConfirmConfirm}</button>
    <button type="button" onclick={onCancel}>{UI_TEXT.resetConfirmCancel}</button>
  </svelte:fragment>
</Modal>
