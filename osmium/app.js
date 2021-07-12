"use strict";

const Log = require("./lib/log.js");
const Bot = require("./lib/bot.js");
const bot = new Bot();

bot.on("ready", () => {
  Log.info("Ready event triggered");
});

bot.on("messageCreate", async msg => {
  if (msg.content === "Test") {
    await msg.reply("Successful test");
  }
});

bot.run();
