<script lang="ts">
  export let min = 0;
  export let max = 1;
  export let step = 0.01;
  export let value = 0.5;

  $: progress = value / max;
</script>

<div>
  <input class="range" type="range" {min} {max} {step} bind:value style="--progress: {100 * progress}%;" />
</div>

<style>
  input {
    width: 100%;
    vertical-align: middle;
  }

  input::-webkit-slider-runnable-track,
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

  input::-webkit-slider-thumb,
  input::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;

    height: 1rem;
    width: 0.5rem;
    border-radius: 0.25rem;
    background-color: #ffffff;
    border: 2px solid var(--color-border);
  }
</style>
