<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let min = 0;
  export let max = 1;
  export let step = 0.01;
  export let value = 0.5;

  $: progress = value / max;

  const dispatch = createEventDispatcher<{ input: number }>();
</script>

<div>
  <input
    class="range"
    type="range"
    {min}
    {max}
    {step}
    bind:value
    style="--progress: {100 * progress}%;"
    on:input={e => dispatch("input", Number(e.currentTarget.value))}
  />
</div>

<style>
  input {
    width: 100%;
    vertical-align: middle;
    -webkit-appearance: none;
    appearance: none;
  }

  input::-webkit-slider-runnable-track {
    height: 0.25rem;
    border-radius: 0.125rem;
    background: linear-gradient(
      to right,
      var(--color-primary) 0%,
      var(--color-primary) var(--progress),
      var(--color-border) var(--progress),
      var(--color-border) 100%
    );
  }

  input::-moz-range-track {
    height: 0.25rem;
    border-radius: 0.125rem;
    background: linear-gradient(
      to right,
      var(--color-primary) 0%,
      var(--color-primary) var(--progress),
      var(--color-border) var(--progress),
      var(--color-border) 100%
    );
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    height: 1.5rem;
    width: 0.75rem;
    margin-top: calc(-0.75rem + 2px);
    border-radius: 0.25rem;
    background-color: #ffffff;
    border: 2px solid var(--color-border);
  }

  input::-moz-range-thumb {
    height: 1.5rem;
    width: 0.75rem;
    box-sizing: border-box;
    border-radius: 0.25rem;
    background-color: #ffffff;
    border: 2px solid var(--color-border);
  }

  input:hover::-webkit-slider-thumb,
  input:hover::-moz-range-thumb {
    background-color: var(--color-border);
  }
</style>
