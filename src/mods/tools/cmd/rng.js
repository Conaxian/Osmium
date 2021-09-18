"use strict";

const Arg = require("../../../lib/cmd/argument");
const { LocStr } = require("../../../lib/locale");
const { randInt } = require("../../../lib/utils");

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
    if (min >= max) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/tools/rng/invalid-range"),
        type: "error"
      });
      ctx.resolve({embeds: embed});
    } else {
      const text = `${randInt(min, max + 1)}`;
      ctx.resolve({text});
    }
  }
};
