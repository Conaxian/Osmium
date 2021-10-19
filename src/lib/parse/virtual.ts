import Context, { ContextType } from "../context";
import Perms from "../perms";
import Config from "../../../config";

import { ParseInput } from "./parse";
import { replyPrefix, getCmd } from "./common";

export default async function virtual({ bot, text }: ParseInput) {
  const perms = new Perms(false, false);

  const ctx = new Context({
    bot,
    text,
    type: ContextType.virtual,
    prefix: Config.prefix,
    perms,
  });

  await replyPrefix(ctx);
  if (ctx.resolved) return ctx;

  await getCmd(ctx);
  return ctx;
}
