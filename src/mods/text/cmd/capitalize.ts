import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { capitalize } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "capitalize",
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text: capitalize(text) });
  },
};

export default command;
