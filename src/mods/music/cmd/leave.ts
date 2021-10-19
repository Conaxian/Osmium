import { CommandDefinition } from "../../../lib/cmd";
import { musicController } from "../../../lib/music";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "leave",
  aliases: ["disconnect", "dc"],

  async *invoke(ctx) {
    const player = musicController.get(ctx.guild!.id);

    if (!player) {
      return await ctx.error($`mod/music/leave/no-voice`);
    }

    player.stop();

    await ctx.ok($`mod/music/leave/success`);
  },
};

export default command;
