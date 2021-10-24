import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";
import { randInt } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "rng",
  aliases: ["random", "randint", "randnum"],
  args: [new Argument("<min>", "int"), new Argument("<max>", "int")],

  async *invoke(ctx, min: number, max: number) {
    if (min >= max) {
      await ctx.error($`mod/tools/rng/invalid-range`);
    } else {
      const text = String(randInt(min, max + 1));
      await ctx.resolve({ text });
    }
  },
};

export default command;
