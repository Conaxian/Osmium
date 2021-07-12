"use strict";

const Bot = require("./lib/bot.js");
const bot = new Bot();

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}`);
});

bot.on("messageCreate", async msg => {
  if (msg.content === "Test") {
    await msg.reply("Successful test");
  }
});

bot.run();
