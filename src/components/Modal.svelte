<script lang="ts">
  import Icon from "./Icon.svelte";

  export let title = "";

  let dialog: HTMLDialogElement;
  export const show = () => dialog.showModal();
  export const hide = () => dialog.close();

  function backdropDismiss(e: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }) {
    const rect = e.currentTarget.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;
    if (!isInDialog) dialog.close();
  }
  // dialog.addEventListener("click", function (event) {
  //   var rect = dialog.getBoundingClientRect();
  //   var isInDialog =
  //     rect.top <= event.clientY &&
  //     event.clientY <= rect.top + rect.height &&
  //     rect.left <= event.clientX &&
  //     event.clientX <= rect.left + rect.width;
  //   if (!isInDialog) {
  //     dialog.close();
  //   }
  // });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<dialog class="modal" bind:this={dialog} on:click={backdropDismiss}>
  <header class="header">
    {#if title}<h2>{title}</h2>{/if}
    <button class="close" on:click={hide}><Icon name="remove" width={12} height={12} /></button>
  </header>
  <slot />
</dialog>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem 1.5rem 1.5rem;
    border: none;
    border-radius: var(--radius-lg);
    box-shadow: 0 12px 16px var(--color-border);
    max-width: var(--max-width, 40rem);
  }

  .modal::backdrop {
    background-color: color-mix(in srgb, var(--color-border) 25%, transparent);
    backdrop-filter: blur(10px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .close {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>
