"use strict";

const {LocStr} = require("../../../lib/locale");
const {author, botInvite, gitHub} = require("../../../../config.json");

module.exports = exports = {
  name: "about",
  aliases: [
    "osmium",
    "github",
    "version"
  ],

  async *invoke(ctx) {
    const text = new LocStr("mod/info/about/text")
      .format(author);
    const fields = [];
    fields.push({
      name: new LocStr("mod/info/about/add-bot"),
      value: botInvite,
      inline: true
    });
    fields.push({
      name: new LocStr("mod/info/about/github"),
      value: gitHub,
      inline: true
    });
    const embed = await ctx.cembed({
      title: new LocStr("mod/info/about/name"),
      text,
      fields,
      type: "info"
    });
    ctx.resolve({embeds: embed});
  }
};
