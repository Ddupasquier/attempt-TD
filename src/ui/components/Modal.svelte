<script lang="ts">
  import type { ModalProps } from "../../types/ui/components/Modal.types";

  const { isOpen, titleId, title, message, actions } = $props<ModalProps>();
</script>

<div class="modal" class:open={isOpen} aria-hidden={isOpen ? "false" : "true"}>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <h2 id={titleId}>
      {@render title?.()}
    </h2>
    <p>
      {@render message?.()}
    </p>
    {@render actions?.()}
  </div>
</div>
