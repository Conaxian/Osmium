"use strict";

const Arg = require("../../../lib/cmd/argument");
const DataIO = require("../../../lib/dataio");
const {LocStr} = require("../../../lib/locale");

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
    if (!guildsData[ctx.guild.id]) guildsData[ctx.guild.id] = {};
    if (!guildsData[ctx.guild.id].config) {
      guildsData[ctx.guild.id].config = {};
    }
    guildsData[ctx.guild.id].config.prefix = prefix;
    await DataIO.write("guilds", guildsData);

    const text = new LocStr("mod/config/prefix/success").format(prefix);
    ctx.resolve({text});
  }
};
