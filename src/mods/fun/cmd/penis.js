"use strict";

const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");
const { randInt } = require("../../../lib/utils");

module.exports = exports = {
  name: "penis",
  args: [new Arg("[target]", "inf-string")],

  async *invoke(ctx, target) {
    const penis = "8" + "=".repeat(randInt(0, 10)) + ">";
    const embed = await ctx.embed({
      title: $`mod/fun/penis/name`,
      text: $`mod/fun/penis/text`.format(target ?? ctx.author, penis),
    });
    ctx.resolve({ embeds: embed });
  },
};
