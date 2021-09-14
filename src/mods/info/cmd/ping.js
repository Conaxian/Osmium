"use strict";

const {LocStr} = require("../../../lib/locale");

module.exports = exports = {
  name: "ping",
  aliases: [
    "test"
  ],

  async *invoke(ctx) {
    let embed;
    embed = await ctx.cembed({
      title: new LocStr("mod/info/ping/name"),
      text: new LocStr("mod/info/ping/text")
        .format("...")
    })
    const msg = yield ctx.output({embeds: embed});

    const ping = msg.createdTimestamp - ctx.msg.createdTimestamp;
    embed = await ctx.cembed({
      title: new LocStr("mod/info/ping/pong"),
      text: new LocStr("mod/info/ping/text")
        .format(ping),
      type: "ok"
    });
    const edited = ctx.output({embeds: embed});
    await ctx.edit(msg, edited);
  }
};
