"use strict";

const Bot = require("./lib/bot");
const bot = new Bot();
const Log = require("./lib/log");
const log = new Log("Main");
const parse = require("./lib/cmd/parse");

log.info("Starting app");

bot.once("ready", () => {
  log.info("Bot is ready");
});

bot.on("messageCreate", async msg => {
  const ctx = await parse({bot, text: msg.content, msg});
  if (!ctx) return;
  if (ctx.command) {
    for await (let output of ctx.command.invoke(ctx)) {
      await bot.out(output, ctx)
    }
  }
  if (ctx.result) await bot.out(ctx.result, ctx);
});

bot.run();
