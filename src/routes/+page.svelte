<script lang="ts">
  import { onMount } from "svelte";
  import FileUploader from "../components/FileUploader.svelte";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  const ctx = new AudioContext();
  let audio: HTMLAudioElement;

  $: if (audio) {
    const source = ctx.createMediaElementSource(audio);
    const gain = new AudioWorkletNode(ctx, "gain");

    source.connect(gain);
    gain.connect(ctx.destination);
  }

  onMount(async () => {
    await ctx.audioWorklet.addModule("/gain.js");
  });
</script>

<div class="wrapper">
  <FileUploader
    accept={["audio/wav"]}
    on:upload={e => {
      file = e.detail.file;
    }}
  />
  {#if url}
    <audio bind:this={audio} src={url} controls />
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
