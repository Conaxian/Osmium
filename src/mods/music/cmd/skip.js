"use strict";

const { $ } = require("../../../lib/loc");
const { guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "skip",
  aliases: ["s"],

  async *invoke(ctx) {
    const player = guildPlayer(ctx.guild.id);
    if (!player) {
      const embed = await ctx.embed({
        text: $`mod/music/leave/no-voice`,
        type: "error",
      });
      return ctx.resolve({ embeds: embed });
    }
    if (!player.playing) {
      const embed = await ctx.embed({
        text: $`music/empty-queue`,
        type: "warn",
      });
      return ctx.resolve({ embeds: embed });
    }
    await player.skip();
  },
};
