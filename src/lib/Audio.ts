let DRY = new Uint8Array();
let WET = new Uint8Array();

export interface Parameter {
  name: string;
  minValue: number;
  maxValue: number;
}

export default class Audio {
  ctx = new AudioContext();
  #el = document.createElement("audio");
  #source = this.ctx.createMediaElementSource(this.#el);
  #worklet?: AudioWorkletNode;

  #dry = this.ctx.createAnalyser();
  #wet = this.ctx.createAnalyser();

  static FFT_SIZE = 512;

  constructor() {
    this.#dry.fftSize = Audio.FFT_SIZE;
    this.#wet.fftSize = Audio.FFT_SIZE;
  }

  set el(el: HTMLAudioElement | undefined) {
    if (!el) return;

    this.#el = el;
    this.#source = this.ctx.createMediaElementSource(this.#el);
    this.#connect();
  }

  async compile(code: string, params: Parameter[]) {
    const worklet = code ? await compile(this.ctx, code, params) : undefined;

    this.#worklet?.port.postMessage("disconnect");
    this.#worklet?.disconnect();
    this.#source.disconnect();
    this.#dry.disconnect();
    this.#wet.disconnect();

    this.#worklet = worklet;
    this.#connect();
  }

  param(key: string, value: number) {
    this.#worklet?.parameters.get(key)?.setValueAtTime(value, 0);
  }

  graphs() {
    if (DRY.length !== this.#dry.frequencyBinCount) DRY = new Uint8Array(this.#dry.frequencyBinCount);
    if (WET.length !== this.#wet.frequencyBinCount) WET = new Uint8Array(this.#wet.frequencyBinCount);

    this.#dry.getByteFrequencyData(DRY);
    this.#wet.getByteFrequencyData(WET);

    return [DRY, WET] as const;
  }

  #connect() {
    this.#source.connect(this.#dry);
    this.#dry.connect(this.#worklet || this.ctx.destination);

    this.#worklet?.connect(this.#wet);
    this.#wet.connect(this.ctx.destination);
  }
}

let n = 0n;

export async function compile(ctx: AudioContext, code: string, params: Parameter[]) {
  const name = `${++n}`;

  const description = params.map(param => ({
    ...param,
    defaultValue: (param.maxValue - param.minValue) / 2,
    automationRate: "k-rate"
  }));

  // The weird keepalive hack is necessary because of this bug in Safari and Chrome: https://bugs.chromium.org/p/chromium/issues/detail?id=921354
  // Once that gets fixed, can just return `false` from `process`

  const src = `
    class Filter extends AudioWorkletProcessor {
      keepalive = true;

      constructor() {
        super();

        this.port.onmessage = msg => {
          if (msg.data === "disconnect") this.keepalive = false;
        };

        Object.defineProperties(this, { process: { value: this.process }, run: { value: this.run } });
      }

      process(inputs, outputs, params) {
        const parameters = new Proxy({}, {
          get(target, prop) {
            return params[prop]?.[0] || 0;
          }
        });

        try {
          this.run(inputs[0], outputs[0], parameters);
        } catch (e) {
          console.error(e);
        }

        return this.keepalive;
      }

      run(input, output, params) {
        ${code}
      }

      static get parameterDescriptors() {
        return ${JSON.stringify(description)};
      }
    }

    registerProcessor(${name}, Filter);
  `;

  const file = new File([src], "fx.js");
  const url = URL.createObjectURL(file.slice(0, file.size, "application/javascript"));
  await ctx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
  return new AudioWorkletNode(ctx, name);
}
