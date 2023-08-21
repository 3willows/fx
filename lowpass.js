// GAIN

for (let i = 0; i < input.length; i++) {
  // gain controls the volume! don't set it higher than 1
  output[i] = input[i] * params.gain;
}

// LONG VERSION

// save the past samples for the moving average
if (!this.samples) this.samples = [];

// the number of samples needed to contain a period of the target frequency
const threshold = Math.ceil(sampleRate / params.freq);

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

// SHORT VERSION

if (!this.prev) this.prev = 0;

const a = params.freq / sampleRate;

for (let i = 0; i < input.length; i++) {
  output[i] = a * input[i] + (1 - a) * this.prev;
  this.prev = output[i];
}
