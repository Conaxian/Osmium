"use strict";

const { LocStr } = require("../../../lib/locale");
const { guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "leave",
  aliases: [
    "disconnect",
    "dc"
  ],

  async *invoke(ctx) {
    const player = guildPlayer(ctx.guild.id);
    if (!player) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/leave/no-voice"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    player.stop();
    const embed = await ctx.cembed({
      text: new LocStr("mod/music/leave/success"),
      type: "ok"
    });
    ctx.resolve({embeds: embed});
  }
};
