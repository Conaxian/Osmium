"use strict";

const Arg = require("../../../lib/cmd/argument");
const { title } = require("../../../lib/utils");

module.exports = exports = {
  name: "title",
  args: [
    new Arg("<text>", "inf-string")
  ],

  async *invoke(ctx, text) {
    ctx.resolve({text: title(text)});
  }
};
