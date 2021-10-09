"use strict";

const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const Arg = require("../../../lib/cmd/argument");
const { $ } = require("../../../lib/loc");
const { escapeMd } = require("../../../lib/utils");
const { Player, Audio, ytSearch, guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "play",
  aliases: ["p", "song", "youtube", "yt"],
  args: [new Arg("<song>", "inf-string")],

  async *invoke(ctx, query) {
    const voice = ctx.author.voice.channel;
    const connection = getVoiceConnection(ctx.guild.id);
    if (!voice) {
      const embed = await ctx.embed({
        text: $`mod/music/join/no-voice`,
        type: "error",
      });
      return ctx.resolve({ embeds: embed });
    }
    if (!connection) {
      const connection = joinVoiceChannel({
        channelId: voice.id,
        guildId: ctx.guild.id,
        adapterCreator: ctx.guild.voiceAdapterCreator,
      });
      new Player(ctx, connection);
      const embed = await ctx.embed({
        text: $`mod/music/join/success`.format(escapeMd(voice.name)),
        type: "ok",
      });
      yield ctx.output({ embeds: embed });
    }

    const url = await ytSearch(query);
    const audio = new Audio(url, ctx.author);
    try {
      await audio.init();
    } catch {
      const embed = await ctx.embed({
        text: $`mod/music/play/not-found`,
        type: "error",
      });
      return ctx.resolve({ embeds: embed });
    }
    const player = guildPlayer(ctx.guild.id);
    await player.add(audio);
    player.start();
  },
};
