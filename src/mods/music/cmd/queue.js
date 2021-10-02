"use strict";

const { $, $union } = require("../../../lib/loc");
const { guildPlayer } = require("../../../lib/music");
const { escapeMd } = require("../../../lib/utils");

module.exports = exports = {
  name: "queue",
  aliases: [
    "q",
  ],

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

    const fields = [];

    let playing = $`mod/music/queue/details`
      .format(player.playing.requestor, player.playing.duration);
    if (player.looping) {
      playing = $union($`mod/music/queue/looping`, playing);
    }
    fields.push({
      name: escapeMd(player.playing.title),
      value: playing,
    });

    for (let audio of player.queue.slice(0, 9)) {
      fields.push({
        name: escapeMd(audio.title),
        value: $`mod/music/queue/details`
          .format(audio.requestor, audio.duration),
      });
    }

    const embed = await ctx.cembed({
      title: $`mod/music/queue/name`,
      text: $`mod/music/queue/text`,
      fields,
      type: "info",
    });
    ctx.resolve({embeds: embed});
  },
}
