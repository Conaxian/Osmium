"use strict";

const {ToWords} = require("to-words");
const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");

const toWords = new ToWords({localeCode: "en-US"});
const MIN = -999999999999999;
const MAX = 999999999999999;

module.exports = exports = {
  name: "numeral",
  aliases: [
    "num2words"
  ],
  args: [
    new Arg("<number>", "num")
  ],

  async *invoke(ctx, number) {
    if (number < MIN || number > MAX) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/text/numeral/out-of-bounds"),
        type: "error"
      });
      ctx.resolve({embeds: embed});
    } else {
      const numeral = toWords.convert(number);
      ctx.resolve({text: numeral});
    }
  }
};
