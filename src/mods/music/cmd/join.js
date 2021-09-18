"use strict";

const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { LocStr } = require("../../../lib/locale");
const { Player } = require("../../../lib/music");
const { escapeMd } = require("../../../lib/utils");

module.exports = exports = {
  name: "join",
  aliases: [
    "connect"
  ],

  async *invoke(ctx) {
    const voice = ctx.author.voice.channel;
    if (!voice) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/join/no-voice"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    if (getVoiceConnection(ctx.guild.id)) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/join/connected"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    const connection = joinVoiceChannel({
      channelId: voice.id,
      guildId: ctx.guild.id,
      adapterCreator: ctx.guild.voiceAdapterCreator
    });
    new Player(ctx, connection);
    const embed = await ctx.cembed({
      text: new LocStr("mod/music/join/success")
        .format(escapeMd(voice.name)),
      type: "ok"
    });
    ctx.resolve({embeds: embed});
  }
};
