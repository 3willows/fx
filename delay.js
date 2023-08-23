// calculate the number of samples in memory
const samples = Math.ceil((params.ms * sampleRate) / 1000);

// initialize the memory
if (!this.index) this.index = 0;
if (!this.memory) this.memory = [];

for (let channel = 0; channel < input.length; channel++) {
  if (this.memory[channel]?.length !== samples) {
    this.memory[channel] = new Float32Array(samples);
    this.index = 0;
  }

  for (let i = 0; i < input[channel].length; i++) {
    // if the first sample in memory was played `ms` milliseconds ago, read it
    let delay = 0;
    if (this.memory[channel].length > samples) delay = this.memory[channel].shift();

    // mix the delayed sample into the output
    output[channel][i] = input[channel][i] + params.feedback * delay;

    // save the output to memory
    this.memory[channel].push(output[channel][i]);
  }
}
