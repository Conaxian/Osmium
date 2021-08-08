"use strict";

const Arg = require("../../../lib/cmd/argument");
const {LocStr} = require("../../../lib/locale");

module.exports = exports = {
  name: "avatar",
  aliases: [
    "pfp"
  ],
  args: [
    new Arg("[member]", "member")
  ],

  async *invoke(ctx, member) {
    member ??= ctx.author;
    const user = member?.user ?? member;
    const avatarUrl = user.displayAvatarURL({dynamic: true, size: 1024});
    const embed = await ctx.cembed({
      image: {
        url: avatarUrl
      },
      author: {
        name: user.username,
        iconURL: avatarUrl
      },
      type: "info"
    });
    ctx.resolve({embeds: embed});
  }
};
