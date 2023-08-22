<script lang="ts">
  import type { Parameter } from "$lib/Audio";
  import Range from "$components/Range.svelte";
  import Icon from "./Icon.svelte";

  export let params: Parameter[] = [];
</script>

<div class="wrapper">
  <table>
    <tbody>
      {#each params as parameter, idx}
        <tr>
          <td class="wide">
            <input class="input" bind:value={parameter.name} placeholder="Parameter name" />
          </td>
          <td class="narrow">
            <input class="input" type="number" bind:value={parameter.minValue} />
          </td>
          <td class="narrow">
            <input class="input" type="number" bind:value={parameter.maxValue} />
          </td>
          <td class="wide range">
            <Range bind:value={parameter.defaultValue} min={parameter.minValue} max={parameter.maxValue} />
          </td>
          <td class="button">
            <button class="remove" on:click={() => (params = params.filter((_, i) => i !== idx))}>
              <Icon name="remove" width={12} height={12} />
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
    border-bottom: none;
  }

  tr:first-child td {
    border-top: none;
  }

  @media (min-width: 960px) {
    tr:last-child td {
      border-bottom: 1px solid var(--color-border);
    }
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

  .remove:hover,
  .remove:focus-visible {
    color: var(--color-negative);
  }

  .remove:focus {
    outline: 0;
  }

  .remove:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }

  .input {
    display: block;
    border: none;
    width: 100%;
    height: 100%;
    padding: 0.75rem;
  }

  tr:first-child td:first-child .input {
    border-top-left-radius: var(--radius-lg);
  }

  tr:first-child td:last-child .remove {
    border-top-right-radius: var(--radius-lg);
  }

  .input:focus {
    outline: 0;
  }

  .input:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
</style>
