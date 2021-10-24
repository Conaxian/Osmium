import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";
import { randInt } from "../../../lib/utils";

const command: CommandDefinition = {
  name: "gay",
  aliases: ["howgay"],
  args: [new Argument("[target]", "inf-string")],

  async *invoke(ctx, target: string) {
    const gayness = randInt(1, 101);

    const embed = await ctx.embed({
      title: $`mod/fun/gay/name`,
      text: $`mod/fun/gay/text`.format(target ?? ctx.author, gayness),
    });
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
