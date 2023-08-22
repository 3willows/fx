<script lang="ts">
  import Editor from "$components/Editor.svelte";
  import FileUploader from "$components/FileUploader.svelte";
  import Parameters from "$components/Parameters.svelte";
  import Panel from "$components/Panel.svelte";
  import Visualizer from "$components/Visualizer.svelte";
  import Icon from "$components/Icon.svelte";
  import Meta from "$components/Meta.svelte";
  import Select from "$components/Select.svelte";

  import Audio from "$lib/Audio";
  import { presets, code, params } from "$lib/filter";
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
  $: {
    audio.compile($code, $params);
    if (window.location.search) history.replaceState("", "", "/");
  }

  let el: HTMLAudioElement;
  $: audio.el = el;

  let setCode: (val: string) => void;
  let openGeneralHelp: () => void;
  let openCodeHelp: () => void;
  let openParametersHelp: () => void;
</script>

<Meta
  title="fxplayground"
  description="fxplayground is a live coding audio playground."
  url="https://fxplayground.pages.dev"
  image=""
/>

<div class="wrapper">
  <header class="header">
    <h1 class="title">FXPlayground</h1>
    <span class="byline">by <a class="author" href="https://jakelazaroff.com">Jake Lazaroff</a></span>

    <div class="actions">
      <Select
        on:change={e => {
          if (!e.currentTarget) return;
          if (!("value" in e.currentTarget)) return;

          const i = Number(e.currentTarget.value);
          const preset = presets[i];
          if (!preset) return;

          setCode(preset.code);
          params.set(preset.params);
        }}
      >
        {#each presets as preset, i}
          <option value={i}>{preset.name}</option>
        {/each}
      </Select>
      <Button on:click={openGeneralHelp}>
        <span class="label">Help</span><Icon name="help" width={12} height={12} />
      </Button>
      <Button on:click={share}><span class="label">Share</span><Icon name="share" width={12} height={12} /></Button>
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
    <Button slot="help" size="sm" on:click={openCodeHelp}>
      <Icon name="help" width={12} height={12} />
    </Button>
    <Editor bind:value={$code} bind:setValue={setCode} />
  </Panel>

  <Panel title="Parameters" --area="params">
    <Button slot="help" size="sm" on:click={openParametersHelp}>
      <Icon name="help" width={12} height={12} />
    </Button>
    <Button slot="actions" on:click={() => params.set([...$params, { name: "", minValue: 0, maxValue: 1 }])}>
      <span>Add parameter</span>
      <Icon name="add" width={12} height={12} />
    </Button>
    <Parameters bind:params={$params} on:change={e => audio.param(e.detail.name, e.detail.value)} />
  </Panel>
</div>

<Modal title="Help" bind:show={openGeneralHelp}>
  <p><strong>fxplayground</strong> is a live coding audio playground.</p>
  <p>
    To get started, upload an audio file and click play. As you edit the code and parameters below, you'll hear the
    modified audio and see the visualization change.
  </p>
  <p>The purple visualizer bars represent your filtered audio. The magenta line represents the original dry signal.</p>
  <p>
    Your work is automatically saved. To share a filter, click the "Share" button and send the URL that gets copied to
    your clipboard.
  </p>
  <p>Have fun!</p>
</Modal>

<Modal title="Code" bind:show={openCodeHelp}>
  <p>
    There are four special variables: <code>input</code>, <code>output</code>, <code>params</code> and
    <code>sampleRate</code>.
  </p>
  <p>
    <code>input</code>
    contains the unmodified samples from the audio file. Your effect should write the corresponding modified samples to the
    <code>output</code> array.
  </p>
  <p>
    <code>params</code> is an object containing the current value of each parameter defined to the right of the code editor.
  </p>
  <p><code>sampleRate</code> contains the sample rate measured in hertz for a single channel.</p>
  <p>You can store state by setting properties on <code>this</code>.</p>
</Modal>

<Modal title="Parameters" bind:show={openParametersHelp}>
  <p>Parameters let you experiment with your effect in real time.</p>
  <p>
    The first column of the table is the parameter's name. The second and third columns are the minimum and maximum
    values. The slider controls the actual value seen by your code.
  </p>
  <p>
    You can access parameters from your code by using the parameter's name as a key on the <code>params</code> object.
    For example, to access the "gain" parameter, you'd write <code>params.gain</code>.
  </p>
</Modal>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: "header" "audio" "waveform" "code" "params";
    padding: 1rem 2rem 2rem;
    gap: 2rem;
  }

  @media (min-width: 960px) {
    .wrapper {
      height: 100%;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "header header" "audio audio" "waveform waveform" "code params";
    }
  }

  .header {
    grid-area: header;
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr auto;
    grid-template-areas: "title actions" "byline actions";
  }

  .title {
    grid-area: title;
    text-transform: lowercase;
    letter-spacing: -0.125ch;
    line-height: 1.25;
  }

  .byline {
    grid-area: byline;
    font-size: var(--text-sm);
  }

  .author {
    font-weight: bold;
    text-decoration-thickness: 2px;
  }

  .actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .label {
    display: none;
  }

  @media (min-width: 540px) {
    .label {
      display: block;
    }
  }
</style>
