import { CommandDefinition } from "../../../lib/cmd";
import { musicController } from "../../../lib/music";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "skip",
  aliases: ["s"],

  async *invoke(ctx) {
    const player = musicController.get(ctx.guild!.id);

    if (!player) {
      return await ctx.error($`mod/music/leave/no-voice`);
    }

    if (!player.playing) {
      return await ctx.warn($`music/empty-queue`);
    }

    await player.skip();
  },
};

export default command;
