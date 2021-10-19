import { GuildMember } from "discord.js";

import Argument from "../../../lib/arg/argument";
import Perms, { permCategories } from "../../../lib/perms";
import Config from "../../../../config";
import { CommandDefinition } from "../../../lib/cmd";
import { FullContext } from "../../../lib/context";
import { $, $union, Localizable } from "../../../lib/loc";
import { attachBlankField } from "../../../lib/utils";

type PermCategory =
  | "administration"
  | "moderation"
  | "text-channels"
  | "voice-channels"
  | "special";

function makePerms(ctx: FullContext, member: GuildMember) {
  const dev = Config.devs.includes(member.id);
  const guildPerms = member.permissions;
  const channelPerms = ctx.channel.permissionsFor(member);

  return new Perms(dev, true, guildPerms, channelPerms);
}

const command: CommandDefinition = {
  name: "perms",
  aliases: ["permissions"],
  args: [new Argument("[member]", "member")],

  async *invoke(ctx, member: GuildMember) {
    member ??= ctx.authorMember!;

    const avatarUrl = member.displayAvatarURL({ dynamic: true, size: 1024 });
    const permissions =
      member.id === ctx.author!.id ? ctx.perms : makePerms(ctx, member);

    const yesUrl = "https://conax.cz";
    const yes = $union(
      "**[",
      $`general/yes`,
      `](${yesUrl}) ${Config.emojis.ok}**`,
    );
    const no = $union("**", $`general/no`, "** " + Config.emojis.error);

    const fields = [];
    for (const category in permCategories) {
      const perms: Localizable[] = [];

      for (const perm of permCategories[category as PermCategory]) {
        const name = $`perms/${perm}`;
        const has = permissions.has(perm);

        perms.push($union(name, " - ", has ? yes : no, "\n"));
      }

      fields.push({
        name: $`perm-categories/${category}`,
        value: $union(...perms),
      });
    }

    attachBlankField(fields, 1);
    attachBlankField(fields, 4);

    const embed = await ctx.embed({
      title: $`mod/info/perms/perms-in`.format(ctx.guild!.name),
      text: $`mod/info/perms/text`.format(member),
      author: {
        name: member.user.username,
        iconUrl: avatarUrl,
      },
      fields,
      type: "info",
    });
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
