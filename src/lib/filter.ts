import { writable } from "svelte/store";

import type { Parameter } from "./Audio";

interface Filter {
  name: string;
  code: string;
  params: Parameter[];
}

export const presets: Filter[] = [
  {
    name: "Gain",
    code: dedent(`
    for (let channel = 0; channel < input.length; channel++) {
      for (let i = 0; i < input[channel].length; i++) {
        // gain controls the volume! don't set it higher than 1
        output[channel][i] = input[channel][i] * params.gain;
      }
    }`),
    params: [{ name: "gain", minValue: 0, maxValue: 1 }]
  },
  {
    name: "Low-Pass Filter",
    code: dedent(`
    if (this.prev?.length !== output.length) this.prev = new Float32Array(output.length);

    const a = params.freq / sampleRate;

    for (let channel = 0; channel < input.length; channel++) {
      for (let i = 0; i < input[channel].length; i++) {
        output[channel][i] = a * input[channel][i] + (1 - a) * this.prev[channel];
        this.prev[channel] = output[channel][i];
      }
    }`),
    params: [{ name: "freq", minValue: 1, maxValue: 48000 }]
  }
  // {
  //   name: "Delay (WIP)",
  //   code: dedent(`
  //   // calculate the number of samples in memory
  //   const samples = Math.ceil(params.ms * sampleRate / 1000);

  //   // initialize the memory
  //   if (this.memory?.[0].length !== output.length) this.memory = new Array(output.length).fill([]);

  //   for (let channel = 0; channel < input.length; channel++) {
  //     // truncate any extra samples in memory
  //     const extra = this.memory[channel].length - samples;
  //     if (extra > 1) this.memory[channel].splice(0, extra - 1);

  //     for (let i = 0; i < input[channel].length; i++) {

  //       // if the first sample in memory was played \`ms\` milliseconds ago, read it
  //       let delay = 0;
  //       console.log(input[channel].length, samples);
  //       if (this.memory[channel].length > samples) delay = this.memory[channel].shift();

  //       // mix the delayed sample into the output
  //       output[channel][i] = input[channel][i] + params.feedback * delay;

  //       // save the output to memory
  //       this.memory[channel].push(output[channel][i]);
  //     }
  //   }`),
  //   params: [
  //     { name: "ms", minValue: 1, maxValue: 1000 },
  //     { name: "feedback", minValue: 0, maxValue: 1 }
  //   ]
  // }
];

const CODE = localStorage.getItem("code") || presets[0]?.code;
const PARAMS = localStorage.getItem("params") || JSON.stringify(presets[0]?.params);

export const code = writable(CODE);
export const params = writable<Parameter[]>(JSON.parse(PARAMS));

code.subscribe(value => localStorage.setItem("code", value));
params.subscribe(value => localStorage.setItem("params", JSON.stringify(value)));

function dedent(str: string) {
  const lines = str.replace(/^\n+/, "").split("\n");

  const indents = lines
    .filter(line => line.trim())
    .map(line => line.match(/^\s+/)?.[0] || "")
    .map(line => line.length);
  const min = Math.min(...indents);

  return lines.map(line => line.slice(min)).join("\n");
}
