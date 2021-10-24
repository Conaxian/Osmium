import { ToWords } from "to-words";

import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";

const MIN = -999_999_999_999_999;
const MAX = 999_999_999_999_999;

const toWords = new ToWords({ localeCode: "en-US" });

const command: CommandDefinition = {
  name: "numeral",
  aliases: ["num2words"],
  args: [new Argument("<number>", "num")],

  async *invoke(ctx, number: number) {
    if (number < MIN || number > MAX) {
      await ctx.error($`mod/text/numeral/out-of-bounds`.format(MIN, MAX));
    } else {
      const numeral = toWords.convert(number);
      await ctx.resolve({ text: numeral });
    }
  },
};

export default command;
