<script lang="ts">
  import icons from "../icons.svg";
  export let name: "add" | "help" | "remove" | "share";
  export let width = 0;
  export let height = 0;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height}>
  <use href={icons + "#" + name} />
</svg>
