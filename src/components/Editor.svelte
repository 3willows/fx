<script lang="ts">
  import { minimalSetup } from "codemirror";
  import { EditorState } from "@codemirror/state";
  import { EditorView, drawSelection } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";

  export let value = "";
  let state = EditorState.create({
    doc: value,
    extensions: [
      minimalSetup,
      javascript(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      EditorView.updateListener.of(function (e) {
        value = e.state.doc.toString();
      })
    ]
  });

  let el: HTMLDivElement;
  $: new EditorView({ state, parent: el });
</script>

<div class="editor" bind:this={el} />

<style>
  .editor {
    height: 100%;
    overflow: hidden;
  }

  .editor :global(.cm-editor) {
    height: 100%;
    box-shadow: inset 0 0 0 1px var(--color-border);
    border-radius: var(--radius-lg);
  }

  .editor :global(.cm-editor.cm-focused) {
    outline: 0;
  }

  .editor :global(.cm-scroller) {
    overflow: auto;
    font-family: var(--font-code);
    padding: 1rem;
  }
</style>
