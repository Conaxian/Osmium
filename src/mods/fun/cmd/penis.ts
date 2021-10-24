import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";
import { randInt } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "penis",
  args: [new Argument("[target]", "inf-string")],

  async *invoke(ctx, target: string) {
    const penis = "8" + "=".repeat(randInt(0, 10)) + ">";

    const embed = await ctx.embed({
      title: $`mod/fun/penis/name`,
      text: $`mod/fun/penis/text`.format(target ?? ctx.author, penis),
    });
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
