import {
  joinVoiceChannel,
  getVoiceConnection,
  DiscordGatewayAdapterCreator,
} from "@discordjs/voice";

import Argument from "../../../lib/arg/argument";
import { CommandDefinition } from "../../../lib/cmd";
import { Player, Audio, musicController } from "../../../lib/music";
import { $ } from "../../../lib/loc";
import { escapeMd, sleep } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "play",
  aliases: ["p", "song", "youtube", "yt"],
  args: [new Argument("<song>", "inf-string")],

  async *invoke(ctx, query: string) {
    const voice = ctx.authorMember!.voice.channel;
    const connection = getVoiceConnection(ctx.guild!.id);

    if (!voice) {
      return await ctx.error($`mod/music/join/no-voice`);
    }

    if (!connection) {
      const connection = joinVoiceChannel({
        channelId: voice.id,
        guildId: ctx.guild!.id,
        adapterCreator: ctx.guild!
          .voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      new Player(ctx, connection);

      const embed = await ctx.embed({
        text: $`mod/music/join/success`.format(escapeMd(voice.name)),
        type: "ok",
      });
      yield await ctx.output({ embeds: embed });
    }

    const audio = await Audio.fromYoutube(query, String(ctx.authorMember));

    for (let i = 0; i < 5; i++) {
      try {
        await audio!.init();
        break;
      } catch (err: any) {
        if (err?.name === "TypeError" || err?.message === "Video unavailable") {
          return await ctx.error($`mod/music/play/not-found`);
        }
        await sleep(1000);
        continue;
      }
    }

    const player = musicController.get(ctx.guild!.id)!;
    await player.add(audio as Required<Audio>);
    await player.start();
  },
};

export default command;
