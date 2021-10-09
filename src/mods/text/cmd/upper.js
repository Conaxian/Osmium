"use strict";

const Arg = require("../../../lib/cmd/argument");

module.exports = exports = {
  name: "upper",
  aliases: ["uppercase", "allcaps"],
  args: [new Arg("<text>", "inf-string")],

  async *invoke(ctx, text) {
    ctx.resolve({ text: text.toUpperCase() });
  },
};
