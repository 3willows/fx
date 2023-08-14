<script lang="ts">
  export let title: string;
</script>

<section class="wrapper">
  <header class="header">
    <h2 class="title">{title}</h2>
    <slot name="actions" />
  </header>
  <slot />
</section>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    color: var(--color-text-secondary);
  }

  .title {
    font-family: var(--font-code);
    font-size: var(--text-md);
    letter-spacing: -0.05ch;
  }
</style>
