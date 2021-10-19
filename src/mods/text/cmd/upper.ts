import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";

const command: CommandDefinition = {
  name: "upper",
  aliases: ["uppercase", "allcaps"],
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text: text.toUpperCase() });
  },
};

export default command;
