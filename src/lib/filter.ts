import { writable } from "svelte/store";

import type { Parameter } from "./Audio";

const DEFAULT_CODE = `
for (let i = 0; i < input.length; i++) {
  // gain controls the volume! don't set it higher than 1
  output[i] = input[i] * params.gain;
}
`.trim();

const DEFAULT_PARAMS = JSON.stringify([{ name: "gain", defaultValue: 1, minValue: 0, maxValue: 1 }]);

const CODE = localStorage.getItem("code") || DEFAULT_CODE;
const PARAMS = localStorage.getItem("params") || DEFAULT_PARAMS;

export const code = writable(CODE);
export const params = writable<Parameter[]>(JSON.parse(PARAMS));

code.subscribe(value => localStorage.setItem("code", value));
params.subscribe(value => localStorage.setItem("params", JSON.stringify(value)));
