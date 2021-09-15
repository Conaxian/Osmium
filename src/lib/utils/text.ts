import { Util as DiscordUtils } from "discord.js";

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function title(string: string) {
  let result = "";
  for (let word of string.split(/( |\t|\n|-)/g)) {
    result += capitalize(word);
  }
  return result;
}

export function mentionId(mention: string) {
  if (+mention) {
    return mention;
  }
  return mention.match(/^<(?:@[!&]?|#)(\d+)>$/)?.[1] ?? null;
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeTemplateStr(string: string) {
  return string.replace(/`|\$/g, "\\$&");
}

export function escapeCode(string: string) {
  return string.replace(/`/g, "´");
}

export function escapeMd(string: string) {
  return DiscordUtils.escapeMarkdown(string);
}
