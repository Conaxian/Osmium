"use strict";

import Bot from "./lib/bot";
import Log from "./lib/log";
import parse from "./lib/cmd/parse";

const bot = new Bot();
const log = new Log("Main");

log.info("Starting app");

bot.on("ready", () => {
  log.info("Bot is ready");
  bot.reload();
});

bot.on("messageCreate", async msg => {
  const ctx = await parse({bot, text: msg.content, msg});
  if (!ctx) return;

  if (!ctx.result && ctx.command) {
    const generator = ctx.command.invoke(ctx, ...Object.values(ctx.args));
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
