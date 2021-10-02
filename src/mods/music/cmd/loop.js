"use strict";

const { $ } = require("../../../lib/loc");
const { guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "loop",

  async *invoke(ctx) {
    const player = guildPlayer(ctx.guild.id);
    if (!player) {
      const embed = await ctx.cembed({
        text: $`mod/music/leave/no-voice`,
        type: "error",
      });
      return ctx.resolve({embeds: embed});
    }

    if (!player.playing) {
      const embed = await ctx.cembed({
        text: $`music/empty-queue`,
        type: "error",
      });
      return ctx.resolve({embeds: embed});
    }

    const startedLoop = await player.loop();
    if (!startedLoop) {
      const embed = await ctx.cembed({
        text: $`mod/music/loop/already-looping`,
        type: "error",
      });
      return ctx.resolve({embeds: embed});
    }
  },
};
