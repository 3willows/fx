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
    for (let i = 0; i < input.length; i++) {
      // gain controls the volume! don't set it higher than 1
      output[i] = input[i] * params.gain;
    }`),
    params: [{ name: "gain", defaultValue: 1, minValue: 0, maxValue: 1 }]
  },
  {
    name: "Low-Pass Filter (WIP)",
    code: dedent(`
    const a = params.freq / sampleRate;

    if (!this.prev) this.prev = 0;
    for (let i = 0; i < input.length; i++) {
      output[i] = a * input[i] + (1 - a) * this.prev;
      this.prev = output[i];
    }`),
    params: [{ name: "freq", defaultValue: 48000, minValue: 1, maxValue: 48000 }]
  }
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
