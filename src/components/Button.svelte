<script lang="ts">
  export let size: "sm" | "md" = "md";
</script>

<button on:click class:sm={size === "sm"} class:md={size === "md"}>
  <slot />
</button>

<style>
  button {
    display: flex;
    align-items: center;
    border: none;
    font-size: var(--text-sm);
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 2rem;
    color: var(--color-primary);
    background-color: var(--color-border);
    transition: background-color 0.25s ease;
  }

  button.sm {
    gap: 0.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;
  }

  button.md {
    gap: 0.5rem;
    padding: 0 1rem;
    height: 2rem;
  }

  button:hover {
    background-color: var(--color-border-hover);
  }
</style>
