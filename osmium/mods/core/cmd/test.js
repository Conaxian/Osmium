"use strict";

const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");

exports.data = {
  name: "test",
  aliases: [
    "testing",
    "tetht"
  ],
  args: [
    new Arg("<alpha>", "word"),
    new Arg("<beta>", "word")
  ],

  async *invoke(ctx, alpha, beta) {
    const embed = await ctx.cembed({
      "text": new LocStr("general/name"),
      "title": `Testing - args: ${alpha}/${beta}`,
      "fields": {"name": "Head", "value": "Content"}
    });
    ctx.resolve({"embeds": embed});
  }
}
