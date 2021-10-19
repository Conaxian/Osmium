import {
  joinVoiceChannel,
  getVoiceConnection,
  DiscordGatewayAdapterCreator,
} from "@discordjs/voice";

import { CommandDefinition } from "../../../lib/cmd";
import { Player } from "../../../lib/music";
import { $ } from "../../../lib/loc";
import { escapeMd } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "join",
  aliases: ["connect"],

  async *invoke(ctx) {
    const voice = ctx.authorMember!.voice.channel;

    if (!voice) {
      return await ctx.error($`mod/music/join/no-voice`);
    }

    if (getVoiceConnection(ctx.guild!.id)) {
      return await ctx.error($`mod/music/join/connected`);
    }

    const connection = joinVoiceChannel({
      channelId: voice.id,
      guildId: ctx.guild!.id,
      adapterCreator: ctx.guild!
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    new Player(ctx, connection);

    await ctx.ok($`mod/music/join/success`.format(escapeMd(voice.name)));
  },
};

export default command;
