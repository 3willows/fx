<script lang="ts">
  export let value = "";
</script>

<textarea class="editor" bind:value rows={10} />

<style>
  .editor {
    padding: 1rem;
    border: 1px solid #eeeeee;
    border-radius: var(--radius-lg);
  }
</style>
