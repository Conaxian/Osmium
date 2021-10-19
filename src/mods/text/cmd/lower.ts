import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";

const command: CommandDefinition = {
  name: "lower",
  aliases: ["lowercase", "nocaps"],
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text: text.toLowerCase() });
  },
};

export default command;
