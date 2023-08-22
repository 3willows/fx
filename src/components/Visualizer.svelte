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

  const wetColor = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");
  const dryColor = getComputedStyle(document.documentElement).getPropertyValue("--color-negative");

  function draw() {
    if (!canvas || !ctx) return requestAnimationFrame(draw);
    const [dry, wet] = audio.graphs();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width - stroke;
    const h = canvas.height - stroke;
    bar(ctx, w, h, wet, wetColor);
    line(ctx, w, h, dry, dryColor);

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
  const stroke = 4;

  function line(ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, color: string) {
    const gutters = gutter * (data.length - 1);
    const width = Math.floor((w - gutter * (data.length - 1)) / data.length);
    const total = width * data.length + gutters;
    let x = Math.floor((w - total) / 2) + width / 2;

    ctx.beginPath();
    let some = false;

    let y = 0;
    for (let i = 0; i < data.length; i++) {
      some = some || Boolean(data[i] || 0);

      y = h - (h * (data[i] || 0)) / 255;
      if (i === 0) ctx.moveTo(x - width / 2, y);
      else if (i === data.length - 1) ctx.lineTo(x + width / 2, y);
      else ctx.lineTo(x, y);

      x += width + gutter;
    }

    ctx.lineWidth = stroke + 8;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    if (some) ctx.stroke();

    ctx.closePath();
  }

  function bar(ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, color: string) {
    const gutters = gutter * (data.length - 1);
    const width = Math.floor((w - gutter * (data.length - 1)) / data.length);
    const total = width * data.length + gutters;
    let x = Math.floor((w - total) / 2);

    ctx.beginPath();
    let some = false;

    let height = 0;
    for (let i = 0; i < data.length; i++) {
      some = some || Boolean(data[i] || 0);

      height = Math.max((h * (data[i] || 0)) / 255, 4);

      ctx.rect(x, canvas.height - height, width, height);

      x += width + gutter;
    }

    ctx.fillStyle = color;
    if (some) ctx.fill();

    ctx.closePath();
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
    height: 5rem;
  }

  .axis {
    display: flex;
    justify-content: space-between;
    color: #999999;
    font-size: var(--text-sm);
  }
</style>
