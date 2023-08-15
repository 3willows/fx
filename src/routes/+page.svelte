<script lang="ts">
  import Editor from "$components/Editor.svelte";
  import FileUploader from "$components/FileUploader.svelte";
  import Parameters from "$components/Parameters.svelte";
  import Panel from "$components/Panel.svelte";
  import Visualizer from "$components/Visualizer.svelte";
  import Icon from "$components/Icon.svelte";

  import Audio from "$lib/Audio";
  import { code, params } from "$lib/filter";
  import Button from "$components/Button.svelte";
  import Modal from "$components/Modal.svelte";

  let file: File;
  let url = "";
  $: {
    if (url) URL.revokeObjectURL(url);
    if (file) url = URL.createObjectURL(file);
  }

  const search = new URLSearchParams(window.location.search);
  try {
    const c = search.get("code");
    if (c) code.set(atob(c));

    const p = search.get("params");
    if (p) params.set(JSON.parse(atob(p)));
  } catch (e) {
    console.error(e);
  }

  function share() {
    const search = new URLSearchParams();
    search.set("code", btoa($code));
    search.set("params", btoa(JSON.stringify($params)));

    history.replaceState("", "", "?" + search.toString());
    navigator.clipboard.writeText(window.location.href);
  }

  const audio = new Audio();
  $: audio.compile($code, $params);

  let el: HTMLAudioElement;
  $: audio.el = el;

  let openHelp: () => void;
</script>

<title>FX Playground</title>

<div class="wrapper">
  <header class="header">
    <h1 class="title">FXPlayground</h1>
    <div class="actions">
      <Button on:click={openHelp}>Help<Icon name="help" width={12} height={12} /></Button>
      <Button on:click={share}>Share<Icon name="share" width={12} height={12} /></Button>
    </div>
  </header>

  <Panel title="Audio" --area="audio">
    {#if url}
      <div>
        <audio bind:this={el} src={url} controls loop />
      </div>
    {:else}
      <FileUploader
        accept={["audio/wav"]}
        on:upload={e => {
          file = e.detail.file;
          audio.ctx.resume();
        }}
      />
    {/if}
  </Panel>

  <Panel title="Frequencies" --area="waveform">
    <Visualizer {audio} />
  </Panel>

  <Panel title="Code" --area="code">
    <Editor bind:value={$code} />
  </Panel>

  <Panel title="Parameters" --area="params">
    <Button
      slot="actions"
      on:click={() => {
        params.set([...$params, { name: "", defaultValue: 0.5, minValue: 0, maxValue: 1 }]);
      }}
    >
      Add parameter
      <Icon name="add" width={12} height={12} />
    </Button>
    <Parameters bind:parameters={$params} />
  </Panel>
</div>

<Modal title="Help" bind:show={openHelp}>
  <p>
    Upload an audio file and click play. As you edit the code below, you'll hear the modified audio and see the
    visualization change.
  </p>
  <p>
    There are three special variables: <code>input</code>, <code>output</code> and <code>parameters</code>.
    <code>input</code>
    contains the unmodified samples from the audio file. Your effect should write the corresponding modified samples to the
    <code>output</code> array.
  </p>
  <p>
    <code>parameters</code> is an object containing the parameters defined to the right of the code editor. For each parameter,
    the text input controls its name, the number inputs control its minimum and maximum values and the slider controls its
    actual value.
  </p>
  <p>
    As you play the audio, the light gray waveform is the dry (original, unmodified) audio. The dark purple waveform is
    your filtered audio.
  </p>
  <p>
    Your work is automatically saved. To share a filter, click the "Share" button and send the URL that gets copied to
    your clipboard.
  </p>
  <p>Have fun!</p>
</Modal>

<style>
  .wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "header header" "audio audio" "waveform waveform" "code params";
    padding: 1rem 2rem 2rem;
    gap: 2rem;
  }

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    text-transform: lowercase;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }
</style>
