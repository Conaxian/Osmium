"use strict";

const Bot = require("./lib/bot.js");
const bot = new Bot();

const Log = require("./lib/log.js");
const log = new Log("Main");

const parse = require("./lib/cmd/parse.js");

log.info("Starting app");

bot.once("ready", () => {
  log.info("Bot is ready");
});

bot.on("messageCreate", async msg => {
  const ctx = await parse({text: msg.content, msg});
  if (!ctx) return;
  log.debug(ctx);
});

bot.run();
