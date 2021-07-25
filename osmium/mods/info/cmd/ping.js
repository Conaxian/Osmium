"use strict";

const {LocStr} = require("../../../lib/locale");

module.exports = exports = {
  name: "ping",
  aliases: [
    "test"
  ],

  async *invoke(ctx) {
    const text = new LocStr("mod/info/ping/ping")
      .format("...");
    const msg = yield ctx.output({text: text});
    const editedText = new LocStr("mod/info/ping/ping")
      .format(msg.createdTimestamp - ctx.msg.createdTimestamp);
    const edited = ctx.output({text: editedText});
    await ctx.edit(msg, edited);
  }
};
