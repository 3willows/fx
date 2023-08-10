<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let accept: string[] = [];

  const dispatch = createEventDispatcher<{ upload: { file: File } }>();
</script>

<input
  type="file"
  accept={accept.join(",")}
  on:change={e => {
    const [file] = e.currentTarget.files || [];
    if (!file) return;

    dispatch("upload", { file });
  }}
/>
