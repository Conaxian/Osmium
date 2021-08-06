"use strict";

const Arg = require("../../../lib/cmd/argument");
const DataIO = require("../../../lib/dataio");
const {LocStr} = require("../../../lib/locale");
const {safeAccess} = require("../../../lib/util");

module.exports = exports = {
  name: "prefix",
  args: [
    new Arg("<prefix>", "word")
  ],
  perms: [
    "manage-guild"
  ],

  async *invoke(ctx, prefix) {
    const guildsData = await DataIO.read("guilds");
    safeAccess(guildsData, `${ctx.guild.id}/config`).prefix = prefix;
    await DataIO.write("guilds", guildsData);

    const text = new LocStr("mod/config/prefix/success").format(prefix);
    ctx.resolve({text});
  }
};
