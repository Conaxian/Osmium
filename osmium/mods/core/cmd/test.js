"use strict";

const Arg = require("../../../lib/cmd/argument");

exports.data = {
  name: "test",
  aliases: [
    "testing",
    "tetht"
  ],
  args: [
    new Arg("<alpha>", "word"),
    new Arg("<beta>", "word")
  ],

  async *invoke(ctx, alpha, beta) {
    ctx.resolve({"content": `Arg1: '${alpha}', Arg2: '${beta}'`});
  }
}
