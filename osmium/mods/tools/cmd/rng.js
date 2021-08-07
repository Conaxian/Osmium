"use strict";

const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");
const {randInt} = require("../../../lib/util");

module.exports = exports = {
  name: "rng",
  aliases: [
    "random",
    "randint",
    "randnum"
  ],
  args: [
    new Arg("<min>", "int"),
    new Arg("<max>", "int")
  ],

  async *invoke(ctx, min, max) {
    let text;
    if (min >= max) {
      text = new LocStr("mod/tools/rng/invalid-range");
    } else {
      text = `${randInt(min, max + 1)}`;
    }
    ctx.resolve({text});
  }
};
