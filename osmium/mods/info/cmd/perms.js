"use strict";

const Arg = require("../../../lib/cmd/argument");
const {Perms} = require("../../../lib/cmd/perms");
const {LocStr, LocGroup} = require("../../../lib/locale");
const {PERM_CATEGORIES} = require("../../../lib/cmd/perms");
const {attachBlankField} = require("../../../lib/util");
const {emojis, devs} = require("../../../config.json");

function makePerms(ctx, member) {
  const dev = devs.includes(member.id);
  const guildPerms = member.permissions;
  const channelPerms = ctx.channel.permissionsFor(member);
  return new Perms(dev, true, guildPerms, channelPerms);
}

module.exports = exports = {
  name: "perms",
  aliases: [
    "permissions"
  ],
  args: [
    new Arg("[member]", "member")
  ],

  async *invoke(ctx, member) {
    member ??= ctx.author;
    const user = member?.user ?? member;
    const avatarUrl = user.displayAvatarURL({dynamic: true, size: 1024});
    const permissions = member.id === ctx.author.id ?
      ctx.perms : makePerms(ctx, member);
    const yesUrl = "https://youtu.be/HIcSWuKMwOw";
    let yes = new LocStr("general/yes");
    yes = new LocGroup("**[", yes, `](${yesUrl}) ${emojis.ok}**`);
    let no = new LocStr("general/no");
    no = new LocGroup("**", no, "** " + emojis.error);

    const fields = [];
    for (let category in PERM_CATEGORIES) {
      const perms = [];
      for (let perm of PERM_CATEGORIES[category]) {
        const name = new LocStr(`perms/${perm}`)
        const has = permissions.has(perm);
        perms.push(new LocGroup(name, " - ", has ? yes : no, "\n"))
      }
      fields.push({
        name: new LocStr(`perm-categories/${category}`),
        value: new LocGroup(...perms),
        inline: true
      });
    }
    attachBlankField(fields, 1);
    attachBlankField(fields, 4);

    const embed = await ctx.cembed({
      title: new LocStr("mod/info/perms/perms-in")
        .format(ctx.guild.name),
      text: new LocStr("mod/info/perms/text")
        .format(member),
      author: {
        name: user.username,
        iconURL: avatarUrl
      },
      fields,
      type: "info"
    });
    ctx.resolve({embeds: embed});
  },
};
