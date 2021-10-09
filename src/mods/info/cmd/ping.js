"use strict";

const { $ } = require("../../../lib/loc");

module.exports = exports = {
  name: "ping",
  aliases: ["test"],

  async *invoke(ctx) {
    let embed;
    embed = await ctx.embed({
      title: $`mod/info/ping/name`,
      text: $`mod/info/ping/text`.format("..."),
      type: "loading",
    });
    const msg = yield ctx.output({ embeds: embed });

    const ping = msg.createdTimestamp - ctx.msg.createdTimestamp;
    embed = await ctx.embed({
      title: $`mod/info/ping/pong`,
      text: $`mod/info/ping/text`.format(ping),
      type: "ok",
    });
    const edited = ctx.output({ embeds: embed });
    await ctx.edit(msg, edited);
  },
};
