import { CommandDefinition } from "../../../lib/cmd";
import { musicController } from "../../../lib/music";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "loop",

  async *invoke(ctx) {
    const player = musicController.get(ctx.guild!.id);

    if (!player) {
      return await ctx.error($`mod/music/leave/no-voice`);
    }

    if (!player.playing) {
      return await ctx.warn($`music/empty-queue`);
    }

    const startedLoop = await player.loop();

    if (!startedLoop) {
      return await ctx.error($`mod/music/loop/already-looping`);
    }
  },
};

export default command;
