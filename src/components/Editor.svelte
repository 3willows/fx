<script lang="ts">
  import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
  import { closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
  import { EditorState } from "@codemirror/state";
  import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
  import { EditorView, drawSelection, highlightActiveLine, keymap } from "@codemirror/view";
  import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
  import { javascript } from "@codemirror/lang-javascript";

  export let value = "";
  let state = EditorState.create({
    doc: value,
    extensions: [
      history(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      closeBrackets(),
      bracketMatching(),
      highlightSelectionMatches(),
      indentOnInput(),
      drawSelection(),
      highlightActiveLine(),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...completionKeymap]),
      EditorState.allowMultipleSelections.of(true),
      javascript(),
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
    letter-spacing: 0;
    padding: 1rem;
  }
</style>
