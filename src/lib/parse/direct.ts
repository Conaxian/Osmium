import Context, { ContextType } from "../context";
import Perms from "../perms";
import Config from "../../../config";
import { notNullish } from "../utils";

import { ParseInput } from "./parse";
import { replyPrefix, getCmd } from "./common";

export default async function virtual({ bot, text, msg }: ParseInput) {
  notNullish(msg);

  const perms = new Perms(Config.devs.includes(msg.author.id), false);

  const ctx = new Context({
    bot,
    text,
    msg,
    type: ContextType.direct,
    prefix: Config.prefix,
    perms,
  });

  await replyPrefix(ctx);
  if (ctx.resolved) return ctx;

  await getCmd(ctx);
  return ctx;
}
