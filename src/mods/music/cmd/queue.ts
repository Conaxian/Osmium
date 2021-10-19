import { CommandDefinition } from "../../../lib/cmd";
import { musicController } from "../../../lib/music";
import { $, $union, Localizable } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "queue",
  aliases: ["q"],

  async *invoke(ctx) {
    const player = musicController.get(ctx.guild!.id);

    if (!player) {
      return await ctx.error($`mod/music/leave/no-voice`);
    }

    if (!player.playing) {
      return await ctx.warn($`music/empty-queue`);
    }

    const fields = [];

    let playing: Localizable = $`mod/music/queue/details`.format(
      player.playing.requestor,
      player.playing.duration,
    );
    if (player.looping) {
      playing = $union($`mod/music/queue/looping`, playing);
    }

    fields.push({
      name: player.playing.escapedTitle,
      value: playing,
      inline: false,
    });

    for (const audio of player.queue.slice(0, 9)) {
      fields.push({
        name: audio.escapedTitle,
        value: $`mod/music/queue/details`.format(
          audio.requestor,
          audio.duration,
        ),
        inline: false,
      });
    }

    const embed = await ctx.embed({
      title: $`mod/music/queue/name`,
      text: $`mod/music/queue/text`,
      fields,
      type: "music",
    });
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
