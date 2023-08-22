<select on:change>
  <slot />
</select>

<style>
  select {
    appearance: none;
    display: flex;
    align-items: center;
    border: none;
    font-size: var(--text-sm);
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 2rem;
    color: var(--color-primary);
    background-origin: center right;
    background: var(--color-border) right 0.75rem center no-repeat
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cg fill='%239159f1'%3E%3Cpath d='M6.354.146a.5.5,0,0,0-.708,0l-3,3A.5.5,0,0,0,3,4H9a.5.5,0,0,0,.354-.854Z' fill='%239159f1'%3E%3C/path%3E%3Cpath d='M9,8H3a.5.5,0,0,0-.354.854l3,3a.5.5,0,0,0,.708,0l3-3A.5.5,0,0,0,9,8Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    transition: background-color 0.25s ease;
    gap: 0.5rem;
    padding: 0 2rem 0 1rem;
    height: 2rem;
  }

  select:hover {
    background-color: var(--color-border-hover);
  }
</style>
