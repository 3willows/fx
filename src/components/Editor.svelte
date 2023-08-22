<script lang="ts">
  import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
  import { closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
  import { EditorState } from "@codemirror/state";
  import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
  import { EditorView, drawSelection, highlightActiveLine, keymap } from "@codemirror/view";
  import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
  import { javascript } from "@codemirror/lang-javascript";

  export let value = "";
  export function setValue(val: string) {
    value = val;
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: val } });
  }

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
  let editor: EditorView;
  $: editor = new EditorView({ state, parent: el });
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
    line-height: 1.5;
    letter-spacing: 0;
    padding: 1rem;
  }

  /* keywords */
  .editor :global(.ͼb) {
    color: #7631ed;
  }

  /* numbers */
  .editor :global(.ͼd) {
    color: #f07178;
  }

  /* strings */
  .editor :global(.ͼe) {
    color: #40b546;
  }

  /* identifiers */
  .editor :global(.ͼg) {
    color: #3374ff;
  }

  /* comments */
  .editor :global(.ͼm) {
    color: #ceb6f6;
  }

  .editor :global(.cm-activeLine) {
    background-color: color-mix(in srgb, var(--color-border) 50%, transparent);
  }

  .editor :global(.cm-selectionBackground),
  .editor :global(.cm-matchingBracket),
  .editor :global(.cm-selectionMatch),
  .editor :global(.cm-selectionMatch > *) {
    background-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }

  .editor :global(::selection) {
    background-color: unset;
    color: unset;
  }
</style>
