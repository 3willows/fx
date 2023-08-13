<script lang="ts">
  import FileUploader from "$components/FileUploader.svelte";
  import Visualizer from "$components/Visualizer.svelte";
  import Audio from "$lib/Audio";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  let code = "for (let i = 0; i < input.length; i++) {\n  output[i] = input[i] * 1;\n}";

  const audio = new Audio();
  let el: HTMLAudioElement;
  $: audio.el = el;
  $: audio.filter(code);
</script>

<div class="wrapper">
  <FileUploader
    accept={["audio/wav"]}
    on:upload={e => {
      file = e.detail.file;
    }}
  />

  {#if url}
    <audio bind:this={el} src={url} controls />
  {/if}

  <Visualizer {audio} />

  <textarea bind:value={code} rows={10} />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
