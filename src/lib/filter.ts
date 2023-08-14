import { writable } from "svelte/store";

import type { Parameter } from "./Audio";

const CODE =
  localStorage.getItem("code") ||
  `for (let i = 0; i < input.length; i++) {\n  output[i] = input[i] * parameters.gain;\n}`;
const PARAMS =
  localStorage.getItem("params") || JSON.stringify([{ name: "gain", defaultValue: 1, minValue: 0, maxValue: 1 }]);

export const code = writable(CODE);
export const params = writable<Parameter[]>(JSON.parse(PARAMS));

code.subscribe(value => localStorage.setItem("code", value));
params.subscribe(value => localStorage.setItem("params", JSON.stringify(value)));
