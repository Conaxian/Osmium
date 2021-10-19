import { CommandDefinition } from "../../../lib/cmd";
import { SpecialPerm } from "../../../lib/perms";
import { musicController } from "../../../lib/music";

const command: CommandDefinition = {
  name: "current-usage",
  aliases: ["cusage"],
  perms: [SpecialPerm.developer],
  hidden: true,

  async *invoke(ctx) {
    let text = "**Guilds currently playing music:**\n\n";
    for (const player of musicController.values()) {
      text += `${player.ctx.guild!.name} (\`${player.ctx.guild!.id}\`)\n`;
    }
    return ctx.resolve({ text });
  },
};

export default command;
