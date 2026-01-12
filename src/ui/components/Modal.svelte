<script lang="ts">
  import type { ModalProps } from "../../types/ui/components/Modal.types";

  const { isOpen, titleId } = $props<ModalProps>();
</script>

<div class="modal" class:open={isOpen} aria-hidden={isOpen ? "false" : "true"}>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <h2 id={titleId}>
      <slot name="title"></slot>
    </h2>
    <p>
      <slot name="message"></slot>
    </p>
    <slot name="actions"></slot>
  </div>
</div>
