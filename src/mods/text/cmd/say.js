"use strict";

const Arg = require("../../../lib/cmd/argument");

module.exports = exports = {
  name: "say",
  args: [new Arg("<text>", "inf-string")],

  async *invoke(ctx, text) {
    ctx.resolve({ text });
  },
};
