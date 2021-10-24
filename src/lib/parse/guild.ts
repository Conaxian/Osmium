import { GuildChannel } from "discord.js";

import Context, { ContextType } from "../context";
import Perms from "../perms";
import Config from "../../../config";
import { logMessage } from "../dataio";
import { notNullish } from "../utils";

import { ParseInput } from "./parse";
import { replyPrefix, getCmd } from "./common";

export default async function guild({ bot, text, msg }: ParseInput) {
  notNullish(msg);
  notNullish(msg.member);
  notNullish(msg.guild);

  const perms = new Perms(
    Config.devs.includes(msg.author.id),
    true,
    msg.member.permissions,
    (msg.channel as GuildChannel).permissionsFor(msg.member),
  );

  const ctx = new Context({
    bot,
    text,
    msg,
    type: ContextType.guild,
    prefix: Config.prefix,
    perms,
  });

  const guildPrefix = (await ctx.guildData())?.config?.prefix;
  ctx.prefix = guildPrefix ?? Config.prefix;

  logMessage(ctx);

  await replyPrefix(ctx);
  if (ctx.resolved) return ctx;

  await getCmd(ctx);
  return ctx;
}
