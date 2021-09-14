"use strict";

import Bot = require("./lib/bot");
const bot = new Bot();
import Log = require("./lib/log");
const log = new Log("Main");
import parse = require("./lib/cmd/parse");

log.info("Starting app");

bot.on("ready", () => {
  log.info("Bot is ready");
  bot.reload();
});

bot.on("messageCreate", async msg => {
  const ctx = await parse({bot, text: msg.content, msg});
  if (!ctx) return;

  if (!ctx.result && ctx.command) {
    const generator = ctx.command.invoke(ctx,
    ...Object.values(ctx.args));
    let result;
    let output;

    while (!result?.done) {
      result = await generator.next(output);
      if (!result.value) break;
      output = await ctx.out(result.value);
    }
  }

  if (ctx.result) await ctx.out(ctx.result);
});

bot.run();
