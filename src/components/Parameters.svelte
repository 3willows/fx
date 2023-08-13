<script lang="ts">
  import type { Parameter } from "$lib/Audio";
  import { createEventDispatcher } from "svelte";

  export let parameters: Parameter[] = [];

  const dispatch = createEventDispatcher<{ tweak: { name: string; value: number } }>();
</script>

<ul>
  {#each parameters as parameter, idx}
    <li class="parameter">
      <input class="input" bind:value={parameter.name} />
      <input class="input" bind:value={parameter.minValue} />
      <input class="input" bind:value={parameter.maxValue} />
      <input
        type="range"
        min={parameter.minValue}
        max={parameter.maxValue}
        step={0.01}
        bind:value={parameter.defaultValue}
      />
      <button
        on:click={() => {
          parameters = parameters.filter((_, i) => i !== idx);
        }}>x</button
      >
    </li>
  {/each}
</ul>

<style>
  .input {
    display: inline-block;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }
</style>
