<script lang="ts">
  import { onMount } from "svelte";
  import FileUploader from "../components/FileUploader.svelte";
  import { compile } from "$lib/worklet";
  import Audio from "$lib/Audio";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  let code = "";

  const sound = new Audio();
  let audio: HTMLAudioElement;
  $: sound.audio = audio;
  $: sound.filter(code);
  // const ctx = new AudioContext();
  // let audio: HTMLAudioElement;
  // let source: MediaElementAudioSourceNode;
  // $: if (audio) source = ctx.createMediaElementSource(audio);

  // let node: AudioWorkletNode;
  // $: if (audio) {
  //   source.disconnect();
  //   node?.disconnect();

  //   if (code) {
  //     compile(ctx, code).then(n => {
  //       source.connect(n);
  //       n.connect(ctx.destination);

  //       node = n;
  //     });
  //   } else source.connect(ctx.destination);
  // }
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

  <textarea bind:value={code} />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
