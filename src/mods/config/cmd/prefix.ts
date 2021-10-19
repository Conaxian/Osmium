import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";
import { AdministrationPerm } from "../../../lib/perms";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "prefix",
  args: [new Argument("<prefix>", "word")],
  perms: [AdministrationPerm.manageGuild],

  async *invoke(ctx, prefix: string) {
    let guildData = await ctx.guildData();

    if (!guildData) guildData = {};
    if (!guildData.config) guildData.config = {};
    guildData.config.prefix = prefix;

    await ctx.setGuildData(guildData);

    await ctx.ok($`mod/config/prefix/success`.format(prefix));
  },
};

export default command;
