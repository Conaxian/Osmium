"use strict";

const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");
const { randInt } = require("../../../lib/utils");

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
      title: $`mod/fun/gay/name`,
      text: $`mod/fun/gay/text`.format(target ?? ctx.author, gayness),
    });
    ctx.resolve({embeds: embed});
  }
};
