"use strict";

const { getVoiceConnection } = require("@discordjs/voice");
const { LocStr } = require("../../../lib/locale");
const { guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "leave",
  aliases: [
    "disconnect",
    "dc"
  ],

  async *invoke(ctx) {
    const voice = getVoiceConnection(ctx.guild.id);
    if (!voice) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/leave/no-voice"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    const player = guildPlayer(ctx.guild.id);
    if (player) player.stop();
    voice.destroy();
    const embed = await ctx.cembed({
      text: new LocStr("mod/music/leave/success"),
      type: "ok"
    });
    ctx.resolve({embeds: embed});
  }
};
