export default class Audio {
  ctx = new AudioContext();
  #el = document.createElement("audio");
  #source = this.ctx.createMediaElementSource(this.#el);
  #worklet?: AudioWorkletNode;

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

    this.#worklet = worklet;
    this.#connect();
  }

  #connect() {
    this.#worklet?.connect(this.ctx.destination);
    this.#source.connect(this.#worklet || this.ctx.destination);
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
