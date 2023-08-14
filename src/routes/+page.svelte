<script lang="ts">
  import Editor from "$components/Editor.svelte";
  import FileUploader from "$components/FileUploader.svelte";
  import Parameters from "$components/Parameters.svelte";
  import Panel from "$components/Panel.svelte";
  import Visualizer from "$components/Visualizer.svelte";

  import Audio from "$lib/Audio";
  import { code, params } from "$lib/filter";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  const audio = new Audio();
  $: audio.compile($code, $params);

  let el: HTMLAudioElement;
  $: audio.el = el;
</script>

<div class="wrapper">
  <Panel title="Audio">
    {#if url}
      <div>
        <audio bind:this={el} src={url} controls loop />
      </div>
    {:else}
      <FileUploader
        accept={["audio/wav"]}
        on:upload={e => {
          file = e.detail.file;
        }}
      />
    {/if}
  </Panel>

  <Panel title="Frequencies">
    <Visualizer {audio} />
  </Panel>

  <div class="editor">
    <Panel title="Code">
      <Editor bind:value={$code} />
    </Panel>

    <Panel title="Parameters">
      <button
        class="button"
        slot="actions"
        on:click={() => {
          params.set([...$params, { name: "", defaultValue: 1, minValue: 0, maxValue: 1 }]);
        }}
      >
        Add parameter
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M11,5H7V1A1,1,0,0,0,5,1V5H1A1,1,0,0,0,1,7H5v4a1,1,0,0,0,2,0V7h4a1,1,0,0,0,0-2Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Parameters bind:parameters={$params} />
    </Panel>
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr;
    padding: 1rem 2rem 2rem;
    gap: 1rem;
  }

  .editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    border: none;
    background-color: transparent;
    font-size: var(--text-sm);
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 0 0 1px var(--color-border);
    border-radius: 2rem;
  }

  .button:hover {
    color: var(--color-text-primary);
  }
</style>
