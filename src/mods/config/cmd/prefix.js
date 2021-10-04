"use strict";

const Arg = require("../../../lib/cmd/argument");
const { readJson, writeJson } = require("../../../lib/dataio");
const { $ } = require("../../../lib/loc");
const { safeAccess } = require("../../../lib/utils");

module.exports = exports = {
  name: "prefix",
  args: [
    new Arg("<prefix>", "word")
  ],
  perms: [
    "manage-guild"
  ],

  async *invoke(ctx, prefix) {
    const guildsData = await readJson("guilds");
    safeAccess(guildsData, `${ctx.guild.id}/config`).prefix = prefix;
    await writeJson("guilds", guildsData);

    const embed = await ctx.cembed({
      text: $`mod/config/prefix/success`.format(prefix),
      type: "ok",
    })
    ctx.resolve({embeds: embed});
  }
};
