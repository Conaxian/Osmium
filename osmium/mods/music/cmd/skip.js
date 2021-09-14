"use strict";

const { LocStr } = require("../../../lib/locale");
const { guildPlayer } = require("../../../lib/music");
const { escapeMd } = require("../../../lib/util");

module.exports = exports = {
  name: "skip",

  async *invoke(ctx) {
    const player = guildPlayer(ctx.guild.id);
    if (!player) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/leave/no-voice"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    if (!player.playing) {
      const embed = await ctx.cembed({
        text: new LocStr("music/empty-queue"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    await player.skip();
  }
};
