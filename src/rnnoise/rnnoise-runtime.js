const base = document.currentScript.src.match(/(.*\/)?/)[0],
  compilation = (
    WebAssembly.compileStreaming ||
    (async (f) => await WebAssembly.compile(await (await f).arrayBuffer()))
  )(fetch(base + "rnnoise-processor.wasm"));

class RNNoiseNode extends AudioWorkletNode {
  static async register(context) {
    module = await compilation;
    await context.audioWorklet.addModule(base + "rnnoise-processor.js");
  }

  constructor(context) {
    super(context, "rnnoise", {
      channelCountMode: "explicit",
      channelCount: 1,
      channelInterpretation: "speakers",
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      processorOptions: {
        module: module,
      },
    });
    this.port.onmessage = ({ data }) => {
      const e = Object.assign(new Event("status"), data);
      this.dispatchEvent(e);
      if (this.onstatus) this.onstatus(e);
    };
  }

  update(keepalive) {
    this.port.postMessage(keepalive);
  }
}
