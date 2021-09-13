"use strict";

const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const Arg = require("../../../lib/cmd/argument");
const { LocStr } = require("../../../lib/locale");
const { escapeMd } = require("../../../lib/util");
const { Player, Audio, ytSearch, guildPlayer } = require("../../../lib/music");

module.exports = exports = {
  name: "play",
  aliases: [
    "p",
    "song",
    "youtube",
    "yt"
  ],
  args: [
    new Arg("<song>", "inf-string")
  ],

  async *invoke(ctx, query) {
    const voice = ctx.author.voice.channel;
    let connection = getVoiceConnection(ctx.guild.id);
    if (!voice) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/join/no-voice"),
        type: "error"
      });
      return ctx.resolve({embeds: embed});
    }
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: voice.id,
        guildId: ctx.guild.id,
        adapterCreator: ctx.guild.voiceAdapterCreator
      });
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/join/success")
          .format(escapeMd(voice.name)),
        type: "ok"
      });
      yield ctx.output({embeds: embed});
    }

    const url = await ytSearch(query);
    if (!url) {
      const embed = await ctx.cembed({
        text: new LocStr("mod/music/play/not-found"),
        type: "error"
      });
      yield ctx.output({embeds: embed});
    }

    const audio = new Audio(url);
    await audio.init();
    const player = guildPlayer(ctx.guild.id) ?? new Player(ctx);
    await player.add(audio);
    await player.start(connection);
  }
};
