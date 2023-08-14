<script lang="ts">
  export let value = "";
</script>

<textarea class="editor" bind:value />

<style>
  .editor {
    height: 100%;
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-family: var(--font-code);
    resize: none;
  }
</style>
