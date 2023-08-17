<button on:click>
  <slot />
</button>

<style>
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
    height: 2rem;
    border: none;
    font-size: var(--text-sm);
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 2rem;
    color: var(--color-primary);
    background-color: var(--color-border);
  }

  button:hover {
    background-color: var(--color-border-hover);
  }
</style>
