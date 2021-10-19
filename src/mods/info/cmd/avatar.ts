import { GuildMember } from "discord.js";

import Argument from "../../../lib/arg";
import { CommandDefinition } from "../../../lib/cmd";

const command: CommandDefinition = {
  name: "avatar",
  aliases: ["pfp"],
  args: [new Argument("[member]", "member")],

  async *invoke(ctx, member: GuildMember) {
    member = member ?? ctx.authorMember;
    const avatarUrl = member.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = await ctx.embed({
      image: {
        url: avatarUrl,
      },
      author: {
        name: member.user.username,
        iconUrl: avatarUrl,
      },
      type: "info",
    });

    await ctx.resolve({ embeds: embed });
  },
};

export default command;
