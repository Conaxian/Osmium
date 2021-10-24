import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { SpecialPerm } from "../../../lib/perms";
import { ActivityType } from "../../../types";

const command: CommandDefinition = {
  name: "set-activity",
  aliases: ["sact"],
  args: [
    new Argument("<type>", "activity-type"),
    new Argument("<name>", "inf-string"),
  ],
  perms: [SpecialPerm.developer],
  hidden: true,

  async *invoke(ctx, type: ActivityType, name: string) {
    ctx.bot.setActivity(name, type);
  },
};

export default command;
