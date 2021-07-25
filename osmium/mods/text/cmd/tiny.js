"use strict";

const tiny = require("tiny-text");
const Arg = require("../../../lib/cmd/argument");

module.exports = exports = {
  name: "tiny",
  aliases: [
    "small"
  ],
  args: [
    new Arg("<text>", "inf-string")
  ],

  async *invoke(ctx, text) {
    ctx.resolve({"text": tiny(text)});
  }
};
