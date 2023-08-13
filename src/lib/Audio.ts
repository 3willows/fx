export default class Audio {
  ctx = new AudioContext();
  #audio = document.createElement("audio");
  #source = this.ctx.createMediaElementSource(this.#audio);
  #worklet?: AudioWorkletNode;

  set audio(el: HTMLAudioElement | undefined) {
    if (!el) return;

    this.#audio = el;
    this.#source = this.ctx.createMediaElementSource(this.#audio);
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

  const mod = ` 
    class Gain extends AudioWorkletProcessor {
      prev = Date.now();
 
      process(inputs, outputs, params) {
        const inputChannels = inputs[0];
        const outputChannels = outputs[0];

 
        this.run(inputChannels, outputChannels);

        const now = Date.now();
        const delta = now - this.prev;
        if (delta >= 1000) {
          this.prev += 1000;
          console.log(${name});
        }
    
        return false;
      }
    
      run(inputs, outputs) {
        ${code}
      }
    }
    
    registerProcessor(${name}, Gain);
  `;

  const file = new File([mod], "fx.js");
  const url = URL.createObjectURL(file);
  await ctx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
  return new AudioWorkletNode(ctx, "" + name);
}

/*


for (let channel = 0; channel < inputs.length; channel++) {
  const input = inputs[channel];
  const output = outputs[channel];

  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] * 0.5;
  }
}
*/
