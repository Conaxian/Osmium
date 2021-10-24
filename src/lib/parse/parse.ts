import { Message } from "discord.js";

import Bot from "../bot";
import Context, { ContextType } from "../context";

import virtual from "./virtual";
import direct from "./direct";
import guild from "./guild";

type Parser = (input: ParseInput) => Promise<Context>;

interface Parsers {
  virtual: Parser;
  guild: Parser;
  direct: Parser;
}

const parsers: Parsers = {
  virtual,
  guild,
  direct,
};

export interface ParseInput {
  bot: Bot;
  text: string;
  msg?: Message;
}

export default async function parse({ bot, text, msg }: ParseInput) {
  const ignoreMsg = msg?.author.bot || msg?.system;
  if (!text || ignoreMsg) return;

  let type: ContextType;

  switch (msg?.channel.type) {
    case undefined:
      type = ContextType.virtual;
      break;

    case "GUILD_TEXT":
    case "GUILD_PUBLIC_THREAD":
    case "GUILD_PRIVATE_THREAD":
      type = ContextType.guild;
      break;

    case "DM":
      type = ContextType.direct;
      break;

    default:
      return;
  }

  const parser = parsers[type.toLowerCase() as keyof Parsers];
  const ctx = await parser({ bot, text, msg });
  return ctx;
}
