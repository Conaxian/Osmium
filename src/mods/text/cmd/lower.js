"use strict";

const Arg = require("../../../lib/cmd/argument");

module.exports = exports = {
  name: "lower",
  aliases: [
    "lowercase",
    "nocaps"
  ],
  args: [
    new Arg("<text>", "inf-string")
  ],

  async *invoke(ctx, text) {
    ctx.resolve({text: text.toLowerCase()});
  }
};
