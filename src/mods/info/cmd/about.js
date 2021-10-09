"use strict";

const { $ } = require("../../../lib/loc");
const { author, botInvite, gitHub } = require("../../../../config");
const { version } = require("../../../lib/utils");

module.exports = exports = {
  name: "about",
  aliases: ["osmium", "github", "version"],

  async *invoke(ctx) {
    const text = $`mod/info/about/text`.format(author);
    const fields = [];
    fields.push({
      name: $`mod/info/about/add-bot`,
      value: botInvite,
    });
    fields.push({
      name: $`mod/info/about/github`,
      value: gitHub,
    });
    fields.push({
      name: $`mod/info/about/version`,
      value: `**\`v${version}\`**`,
    });
    const embed = await ctx.embed({
      title: $`mod/info/about/name`,
      text,
      fields,
      type: "info",
    });
    ctx.resolve({ embeds: embed });
  },
};
