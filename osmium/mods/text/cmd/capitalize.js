"use strict";

const Arg = require("../../../lib/cmd/argument");
const {capitalize} = require("../../../lib/util");

module.exports = exports = {
  name: "capitalize",
  args: [
    new Arg("<text>", "inf-string")
  ],

  async *invoke(ctx, text) {
    ctx.resolve({text: capitalize(text)});
  }
};
