const dt = 1 / sampleRate;
const RC = 1 / (2 * Math.PI * parameters.freq);
const alpha = dt / (RC + dt);

this.prevOut = this.prevOut || 0;
this.prevIn = this.prevIn || 0;
for (let i = 0; i < input.length; i++) {
  output[i] = alpha * (this.prevOut + input[i] - this.prevIn);
  this.prevIn = input[i];
  this.prevOut = output[i];
}

// this.prev = this.prev || 0;
// for (let i = 0; i < input.length; i++) {
//   output[i] = (1 - alpha) * (input[i] - this.prev);
//   this.prev = input[i];
// }

// windowing function
// w(n) = 0.5 * (1 - cos(2 * pi * n / (N - 1)))

// save the past samples for the moving average
if (!this.samples) this.samples = [];

// the number of samples needed to contain a period of the target frequency
const threshold = Math.ceil(sampleRate / parameters.freq);

for (let i = 0; i < input.length; i++) {
  // check to see if the average data contains more samples than the threshold
  const extra = this.samples.length - threshold;

  // remove any extra samples above the threshold
  if (extra >= 1) this.samples.splice(0, extra);

  // add the current sample to the list
  this.samples.push(input[i]);

  // sum up all the samples
  let sum = 0;
  for (let j = 0; j < this.samples.length; j++) {
    sum += this.samples[j];
  }

  // set the output to the moving average
  output[i] = sum / this.samples.length;
}
