<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let accept: string[] = [];

  const dispatch = createEventDispatcher<{ upload: { file: File } }>();

  let filename = "";
</script>

<div class="wrapper">
  <p>
    {#if filename}
      {filename}
    {:else}
      Click here or drag a file to upload.
    {/if}
  </p>

  <input
    class="input"
    type="file"
    accept={accept.join(",")}
    on:change={e => {
      const [file] = e.currentTarget.files || [];
      if (!file) return;

      filename = file.name;
      dispatch("upload", { file });
    }}
  />
</div>

<style>
  .wrapper {
    position: relative;
    overflow: hidden;
    border: 2px dashed #eeeeee;
    text-align: center;
    padding: 1rem;
    border-radius: var(--radius-lg);
  }

  .wrapper:hover {
    border-color: #dddddd;
  }

  .input {
    position: absolute;
    width: 200%;
    height: 100%;
    top: 0;
    left: -100%;
    cursor: pointer;
  }
</style>
