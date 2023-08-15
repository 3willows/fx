<button on:click>
  <slot />
</button>

<style>
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border: none;
    font-size: var(--text-sm);
    font-weight: bold;
    cursor: pointer;
    border-radius: 2rem;
    color: var(--color-primary);
    background-color: var(--color-border);
  }

  button:hover {
    color: var(--color-text-primary);
  }
</style>
