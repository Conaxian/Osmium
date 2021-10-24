// @ts-ignore: tiny-text doesn't have TS type declarations
import tiny from "tiny-text";

import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";

const command: CommandDefinition = {
  name: "tiny",
  aliases: ["small"],
  args: [new Argument("<text>", "inf-string")],

  async *invoke(ctx, text: string) {
    await ctx.resolve({ text: tiny(text) });
  },
};

export default command;
