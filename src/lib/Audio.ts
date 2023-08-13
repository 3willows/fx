let DRY = new Uint8Array();
let WET = new Uint8Array();

export default class Audio {
  ctx = new AudioContext();
  #el = document.createElement("audio");
  #source = this.ctx.createMediaElementSource(this.#el);
  #worklet?: AudioWorkletNode;

  #dry = this.ctx.createAnalyser();
  #wet = this.ctx.createAnalyser();

  constructor() {
    this.#dry.fftSize = 256;
    this.#wet.fftSize = 256;
  }

  set el(el: HTMLAudioElement | undefined) {
    if (!el) return;

    this.#el = el;
    this.#source = this.ctx.createMediaElementSource(this.#el);
    this.#connect();
  }

  async filter(code: string) {
    const worklet = code ? await compile(this.ctx, code) : undefined;
    this.#worklet?.disconnect();
    this.#source.disconnect();
    this.#dry.disconnect();
    this.#wet.disconnect();

    this.#worklet = worklet;
    this.#connect();
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

let n = 0;

export async function compile(ctx: AudioContext, code: string) {
  const name = `${++n}`;

  const src = `
    class Gain extends AudioWorkletProcessor {
      prev = Date.now();
 
      process(inputs, outputs, params) {
        const inputChannels = inputs[0];
        const outputChannels = outputs[0];

        for (let channel = 0; channel < inputChannels.length; channel++) {
          const input = inputChannels[channel];
          const output = outputChannels[channel];

          this.run(input, output);
        }

        // const now = Date.now();
        // const delta = now - this.prev;
        // if (delta >= 1000) {
        //   this.prev += 1000;
        //   console.log(${name});
        // }
    
        return false;
      }
    
      run(input, output) {
        ${code}
      }
    }
    
    registerProcessor(${name}, Gain);
  `;

  const file = new File([src], "fx.js");
  const url = URL.createObjectURL(file);
  await ctx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
  return new AudioWorkletNode(ctx, "" + name);
}
