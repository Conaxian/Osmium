import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";

const command: CommandDefinition = {
  name: "say",
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text });
  },
};

export default command;
