"use strict";

const { LocStr } = require("../../../lib/locale");
const { guildPlayer } = require("../../../lib/music");
const { escapeMd } = require("../../../lib/utils").default;

module.exports = exports = {
  name: "queue",
  aliases: [
    "q",
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
    if (!player.playing) {
      const embed = await ctx.cembed({
        text: new LocStr("music/empty-queue"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }

    const fields = [];
    fields.push({
      name: escapeMd(player.playing.title),
      value: new LocStr("mod/music/queue/details")
        .format(player.playing.requestor, player.playing.duration),
    });
    for (let audio of player.queue.slice(0, 9)) {
      fields.push({
        name: escapeMd(audio.title),
        value: new LocStr("mod/music/queue/details")
          .format(audio.requestor, audio.duration),
      });
    }
    const embed = await ctx.cembed({
      title: new LocStr("mod/music/queue/name"),
      text: new LocStr("mod/music/queue/text"),
      fields,
      type: "info",
    });
    ctx.resolve({embeds: embed});
  },
}
