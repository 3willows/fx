class Gain extends AudioWorkletProcessor {
  process(inputs, outputs, params) {
    const inputChannels = inputs[0];
    const outputChannels = outputs[0];

    for (let channel = 0; channel < inputChannels.length; channel++) {
      const input = inputChannels[channel];
      const output = outputChannels[channel];

      for (let i = 0; i < input.length; i++) {
        output[i] = input[i] * 0.5;
      }
    }

    return true;
  }
}

registerProcessor("gain", Gain);
