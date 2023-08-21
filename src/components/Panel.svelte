<script lang="ts">
  export let title: string;
</script>

<section class="wrapper">
  <header class="header">
    <h2 class="title">{title}</h2>
    <slot name="help" />
    {#if $$slots.actions}
      <div class="actions">
        <slot name="actions" />
      </div>
    {/if}
  </header>
  <slot />
</section>

<style>
  .wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: clip;
    overflow-clip-margin: 1rem;
    grid-area: var(--area);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    height: 3rem;
    color: var(--color-text-secondary);
  }

  .title {
    font-size: var(--text-lg);
    letter-spacing: -0.05ch;
    font-weight: bold;
  }

  .actions {
    margin-left: auto;
  }
</style>
