"use strict";

const Arg = require("../../../lib/cmd/argument");
const { Perms } = require("../../../lib/cmd/perms");
const { $, $union } = require("../../../lib/loc");
const { PERM_CATEGORIES } = require("../../../lib/cmd/perms");
const { attachBlankField } = require("../../../lib/utils");
const { emojis } = require("../../../../config");

function makePerms(ctx, member) {
  const guildPerms = member.permissions;
  const channelPerms = ctx.channel.permissionsFor(member);
  return new Perms(false, true, guildPerms, channelPerms);
}

module.exports = exports = {
  name: "perms",
  aliases: ["permissions"],
  args: [new Arg("[member]", "member")],

  async *invoke(ctx, member) {
    member ??= ctx.author;
    const user = member?.user ?? member;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
    const permissions =
      member.id === ctx.author.id ? ctx.perms : makePerms(ctx, member);
    const yesUrl = "https://youtu.be/HIcSWuKMwOw";
    let yes = $`general/yes`;
    yes = $union("**[", yes, `](${yesUrl}) ${emojis.ok}**`);
    let no = $`general/no`;
    no = $union("**", no, "** " + emojis.error);

    const fields = [];
    for (let category in PERM_CATEGORIES) {
      const perms = [];
      for (let perm of PERM_CATEGORIES[category]) {
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
      title: $`mod/info/perms/perms-in`.format(ctx.guild.name),
      text: $`mod/info/perms/text`.format(member),
      author: {
        name: user.username,
        iconUrl: avatarUrl,
      },
      fields,
      type: "info",
    });
    ctx.resolve({ embeds: embed });
  },
};
