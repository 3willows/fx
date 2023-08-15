<script lang="ts">
  export let audio: { graphs(): readonly [Uint8Array, Uint8Array] };

  let canvas: HTMLCanvasElement;
  $: ctx = canvas?.getContext("2d");

  let w: number;
  let h: number;
  $: if (canvas) {
    const ratio = window.devicePixelRatio;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
  }

  const primary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");
  const border = getComputedStyle(document.documentElement).getPropertyValue("--color-border");

  function draw() {
    if (!canvas || !ctx) return requestAnimationFrame(draw);
    const [dry, wet] = audio.graphs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waveform(dry, border);
    waveform(wet, primary);

    requestAnimationFrame(draw);
  }

  // function compress(amplitudes: Uint8Array, bins: number) {
  //   const result = new Uint8Array(bins);

  //   const numbers: number[] = [];
  //   for (let i = 0; i < bins; i++) {
  //     const start = Math.floor(Math.pow(1.1, i));
  //     const end = Math.floor(Math.pow(1.1, i + 1));
  //     numbers[i] = end - start;
  //     result[i] = amplitudes.slice(start, end).reduce((sum, v) => sum + v, 0) / (end - start);
  //   }

  //   console.log(numbers);
  //   return result;
  // }

  const gutter = 1;
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

  // TODO: average diffs to get envelope shape
  // https://math.stackexchange.com/questions/106700/incremental-averaging
</script>

<figure class="wrapper">
  <canvas class="canvas" bind:this={canvas} bind:clientWidth={w} bind:clientHeight={h} />
  <figcaption class="axis">
    <span>0 Hz</span>
    <span>24 kHz</span>
  </figcaption>
</figure>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .canvas {
    width: 100%;
    height: 10rem;
  }

  .axis {
    display: flex;
    justify-content: space-between;
    color: #999999;
    font-size: var(--text-sm);
  }
</style>
