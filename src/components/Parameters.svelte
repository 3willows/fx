<script lang="ts">
  import type { Parameter } from "$lib/Audio";
  import { createEventDispatcher } from "svelte";

  export let parameters: Parameter[] = [];

  const dispatch = createEventDispatcher<{ tweak: { name: string; value: number } }>();
</script>

<ul class="parameters">
  {#each parameters as parameter, idx}
    <li class="parameter">
      <input class="input" bind:value={parameter.name} />
      <input class="input number" bind:value={parameter.minValue} />
      <input class="input number" bind:value={parameter.maxValue} />
      <input
        type="range"
        min={parameter.minValue}
        max={parameter.maxValue}
        step={0.01}
        bind:value={parameter.defaultValue}
      />
      <button class="remove" on:click={() => (parameters = parameters.filter((_, i) => i !== idx))}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </li>
  {/each}
</ul>

<style>
  .parameters {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .parameter {
    display: grid;
    grid-template-columns: 1fr auto auto 1fr auto;
    gap: 0.75rem;
    align-items: center;
  }

  .input {
    display: block;
    width: auto;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-family: var(--font-code);
  }

  .number {
    width: 5rem;
  }

  .remove {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>
