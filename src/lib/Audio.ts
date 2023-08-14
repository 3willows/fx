let DRY = new Uint8Array();
let WET = new Uint8Array();

export interface Parameter {
  name: string;
  defaultValue: number;
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

  static FFT_SIZE = 1024;
  static SMOOTHING_TIME_CONSTANT = 0.9;

  constructor() {
    this.#dry.fftSize = Audio.FFT_SIZE;
    this.#wet.fftSize = Audio.FFT_SIZE;

    this.#dry.smoothingTimeConstant = Audio.SMOOTHING_TIME_CONSTANT;
    this.#wet.smoothingTimeConstant = Audio.SMOOTHING_TIME_CONSTANT;
  }

  set el(el: HTMLAudioElement | undefined) {
    if (!el) return;

    this.#el = el;
    this.#source = this.ctx.createMediaElementSource(this.#el);
    this.#connect();
  }

  async compile(code: string, params: Parameter[]) {
    const worklet = code ? await compile(this.ctx, code, params) : undefined;
    this.#worklet?.disconnect();
    this.#source.disconnect();
    this.#dry.disconnect();
    this.#wet.disconnect();

    this.#worklet = worklet;
    this.#connect();
  }

  // param(key: string, value: number) {
  //   this.#worklet?.parameters.get(key)?.setValueAtTime(value, 0);
  // }

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

export async function compile(ctx: AudioContext, code: string, params: Parameter[]) {
  const name = `${++n}`;

  const description = params.map(param => ({
    ...param,
    defaultValue: Math.min(param.maxValue, Math.max(param.defaultValue, param.minValue)),
    automationRate: "k-rate"
  }));

  const src = `
    class Gain extends AudioWorkletProcessor {
      prev = Date.now();
 
      process(inputs, outputs, parameters) {
        const inputChannels = inputs[0];
        const outputChannels = outputs[0];

        for (let channel = 0; channel < inputChannels.length; channel++) {
          const input = inputChannels[channel];
          const output = outputChannels[channel];

          const params = new Proxy({}, {
            get(target, prop) {
              return parameters[prop]?.[0] || 0;
            }
          });

          this.run(input, output, params);
        }
    
        return false;
      }
    
      run(input, output, parameters) {
        ${code}
      }

      static get parameterDescriptors() {
        return ${JSON.stringify(description)};
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
