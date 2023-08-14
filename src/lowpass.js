const dt = 1 / sampleRate;
const RC = 1 / (2 * Math.PI * parameters.freq);
const alpha = RC / (RC + dt);

// this.prevOut = this.prevOut || 0;
// this.prevIn = this.prevIn || 0;
// for (let i = 0; i < input.length; i++) {
//   output[i] = alpha * (this.prevOut + input[i] - this.prevIn);
//   this.prevIn = input[i];
//   this.prevOut = output[i];
// }

this.prev = this.prev || 0;
for (let i = 0; i < input.length; i++) {
  output[i] = (1 - alpha) * this.prev + alpha - input[i];
  this.prev = output[i];
}
