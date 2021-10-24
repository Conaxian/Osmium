import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { title } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "title",
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text: title(text) });
  },
};

export default command;
