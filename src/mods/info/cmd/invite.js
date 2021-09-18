"use strict";

const INVITE_URL = "https://discord.gg/"

module.exports = exports = {
  name: "invite",

  async *invoke(ctx) {
    const user = ctx.author?.user ?? ctx.author;
    const invite = ctx.guild.vanityURLCode ?
      INVITE_URL + ctx.guild.vanityURLCode :
      (await ctx.channel.createInvite({
        maxAge: 0,
        reason: `Created by ${user.tag}`
      })).url;
    ctx.resolve({text: invite});
  }
};
