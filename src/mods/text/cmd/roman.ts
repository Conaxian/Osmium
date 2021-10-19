// @ts-ignore: cr-numeral doesn't have TS type declarations
import { convertNumberToRoman as toRoman } from "cr-numeral";

import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";

const MIN = 1;
const MAX = 4999;

const command: CommandDefinition = {
  name: "roman",
  aliases: ["romanum"],
  args: [new Argument("<number>", "int")],

  async *invoke(ctx, number: number) {
    if (number < MIN || number > MAX) {
      await ctx.error($`mod/text/numeral/out-of-bounds`.format(MIN, MAX));
    } else {
      await ctx.resolve({ text: toRoman(number) });
    }
  },
};

export default command;
