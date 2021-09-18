"use strict";

const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");
const {randInt} = require("../../../lib/utils").default;

module.exports = exports = {
  name: "gay",
  aliases: [
    "howgay"
  ],
  args: [
    new Arg("[target]", "inf-string")
  ],

  async *invoke(ctx, target) {
    const gayness = randInt(1, 101);
    const embed = await ctx.cembed({
      title: new LocStr("mod/fun/gay/name"),
      text: new LocStr("mod/fun/gay/text")
        .format(target ?? ctx.author, gayness)
    })
    ctx.resolve({embeds: embed});
  }
};
