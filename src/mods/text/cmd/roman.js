"use strict";

const { convertNumberToRoman: toRoman } = require("cr-numeral");
const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");

const MIN = 1;
const MAX = 4999;

module.exports = exports = {
  name: "roman",
  aliases: [
    "romanum"
  ],
  args: [
    new Arg("<number>", "int")
  ],

  async *invoke(ctx, number) {
    if (number < MIN || number > MAX) {
      const embed = await ctx.cembed({
        text: $`mod/text/numeral/out-of-bounds`.format(MIN, MAX),
        type: "error",
      });
      ctx.resolve({embeds: embed});
    } else {
      ctx.resolve({text: toRoman(number)});
    }
  }
};
