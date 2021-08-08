"use strict";

const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");
const {randInt} = require("../../../lib/util");

module.exports = exports = {
  name: "penis",
  args: [
    new Arg("[target]", "inf-string")
  ],

  async *invoke(ctx, target) {
    const penis = "8" + "=".repeat(randInt(0, 10)) + ">";
    const embed = await ctx.cembed({
      title: new LocStr("mod/fun/penis/name"),
      text: new LocStr("mod/fun/penis/text")
        .format(target ?? ctx.author, penis)
    })
    ctx.resolve({embeds: embed});
  }
};
