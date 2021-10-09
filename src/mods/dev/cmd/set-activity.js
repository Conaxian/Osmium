"use strict";

const Arg = require("../../../lib/cmd/argument");

module.exports = exports = {
  name: "set-activity",
  aliases: ["sact"],
  args: [new Arg("<type>", "activity-type"), new Arg("<name>", "inf-string")],
  permissions: ["developer"],
  hidden: true,

  async *invoke(ctx, type, name) {
    ctx.bot.setActivity(name, type);
  },
};
