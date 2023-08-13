<script lang="ts">
  import Editor from "$components/Editor.svelte";
  import FileUploader from "$components/FileUploader.svelte";
  import Parameters from "$components/Parameters.svelte";
  import Visualizer from "$components/Visualizer.svelte";

  import Audio, { type Parameter } from "$lib/Audio";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  const audio = new Audio();
  let el: HTMLAudioElement;
  $: audio.el = el;

  let code = "for (let i = 0; i < input.length; i++) {\n  output[i] = input[i] * parameters.gain;\n}";
  let params: Parameter[] = [{ name: "gain", defaultValue: 1, minValue: 0, maxValue: 1 }];
  $: audio.compile(code, params);
</script>

<div class="wrapper">
  <FileUploader
    accept={["audio/wav"]}
    on:upload={e => {
      file = e.detail.file;
    }}
  />

  {#if url}
    <audio bind:this={el} src={url} controls loop />
  {/if}

  <Visualizer {audio} />

  <div class="editor">
    <h2>Code</h2>
    <Editor bind:value={code} />
    <header>
      <h2>Parameters</h2>
      <button
        on:click={() => {
          params = [...params, { name: "", defaultValue: 1, minValue: 0, maxValue: 1 }];
        }}
      >
        add
      </button>
    </header>

    <Parameters bind:parameters={params} />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
  }
  /* 
  .editor {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
  } */
</style>
