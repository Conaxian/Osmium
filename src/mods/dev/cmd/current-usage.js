"use strict";

const { players } = require("../../../lib/music");

module.exports = exports = {
  name: "current-usage",
  aliases: [
    "cusage",
  ],
  permissions: [
    "developer",
  ],
  hidden: true,

  async *invoke(ctx) {
    let text = "**Currently playing:**\n\n";
    for (let player of players.values()) {
      text += `${player.ctx.guild.name} (\`${player.ctx.guild.id}\`)\n`
    }
    return ctx.resolve({text});
  },
};
