<script lang="ts">
  export let audio: { graphs(): readonly [Uint8Array, Uint8Array] };

  let canvas: HTMLCanvasElement;
  $: ctx = canvas?.getContext("2d");

  let w: number;
  let h: number;
  $: if (canvas) {
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
  }

  function draw() {
    if (!canvas || !ctx) return requestAnimationFrame(draw);
    const [dry, wet] = audio.graphs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waveform(dry, "black");
    waveform(wet, "green");

    requestAnimationFrame(draw);
  }

  const gutter = 2;
  function waveform(data: Uint8Array, color: string) {
    if (!canvas || !ctx) return;

    const gutters = gutter * (data.length - 1);
    const width = Math.floor((canvas.width - gutter * (data.length - 1)) / data.length);
    const total = width * data.length + gutters;
    let x = Math.floor((canvas.width - total) / 2);

    let height = 0;
    for (let i = 0; i < data.length; i++) {
      height = Math.max((canvas.height * (data[i] || 0)) / 255, 4);

      ctx.fillStyle = color;
      ctx.fillRect(x, canvas.height - height, width, height);

      x += width + gutter;
    }
  }

  draw();
</script>

<canvas class="canvas" bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h} />

<style>
  .canvas {
    width: 100%;
    height: 10rem;
  }
</style>
