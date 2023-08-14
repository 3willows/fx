<script lang="ts">
  import type { Parameter } from "$lib/Audio";
  import Range from "$components/Range.svelte";

  export let parameters: Parameter[] = [];
</script>

<div class="wrapper">
  <table>
    <tbody>
      {#each parameters as parameter, idx}
        <tr>
          <td class="wide">
            <input class="input" bind:value={parameter.name} placeholder="Parameter name" />
          </td>
          <td class="narrow">
            <input class="input number" bind:value={parameter.minValue} />
          </td>
          <td class="narrow">
            <input class="input number" bind:value={parameter.maxValue} />
          </td>
          <td class="wide range">
            <Range bind:value={parameter.defaultValue} />
          </td>
          <td class="button">
            <button class="remove" on:click={() => (parameters = parameters.filter((_, i) => i !== idx))}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .wrapper {
    overflow: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  table {
    border-collapse: collapse;
  }

  tr {
    vertical-align: top;
  }

  td {
    vertical-align: middle;
    height: 2.5rem;
    border: 1px solid var(--color-border);
  }

  tr:first-child td {
    border-top: none;
  }

  td:first-child {
    border-left: none;
  }

  td:last-child {
    border-right: none;
  }

  td.wide {
    width: 35%;
  }

  td.narrow {
    width: 15%;
  }

  .range {
    padding: 0 1rem;
  }

  td.button {
    min-width: 2.5rem;
    width: 2.5rem;
  }

  .remove {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .remove:hover {
    background-color: var(--color-border);
  }

  .input {
    display: block;
    border: none;
    width: 100%;
    height: 100%;
    padding: 0.75rem;
  }

  .range {
    overflow: hidden;
  }

  .range::-webkit-slider-runnable-track,
  .range::-moz-range-track {
    background-color: var(--color-border);
    height: 0.25rem;
    border-radius: 0.125rem;
  }

  .range::-webkit-slider-thumb,
  .range::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;

    height: 1rem;
    width: 0.5rem;
    background-color: #ffffff;
    /* border-radius: 50%; */
    border: 2px solid var(--color-border);
    /* box-shadow: -10.5rem 0 0 10rem var(--color-primary); */
  }
</style>
