import { Message } from "discord.js";

import Bot from "./lib/bot";
import Log from "./lib/log";
import parse from "./lib/parse";
import { Output, declareFull } from "./lib/context";

const bot = new Bot();
const log = new Log("Main");

log.info("Starting app");

bot.on("ready", () => {
  log.info("Bot is ready");
});

bot.on("messageCreate", async (msg) => {
  const ctx = await parse({ bot, text: msg.content, msg });

  if (!ctx) return;
  declareFull(ctx);

  if (!ctx.resolved && ctx.command) {
    const generator = ctx.command.invoke(ctx, ...Object.values(ctx.args));
    let result: IteratorResult<Output, void> | undefined;
    let output: Message;

    while (!result?.done) {
      result = await generator.next(output!);
      if (!result.value) break;
      output = await ctx.out(result.value);
    }
  }

  if (ctx.resolved) await ctx.finalize();
});

bot.run();
