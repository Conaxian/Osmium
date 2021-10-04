import { appendFile } from "fs/promises";

import { fullDate } from "../timestamp";

const LOG_PATH = "data/log.txt";

function logDataEntry(name: string, id: string) {
  name = name.replace(/\\\\/g, "//");
  return `${name}\\\\(${id})`;
}

export async function logMessage(ctx: any) { // TODO: Add context type
  const content = ctx.text.replace(/\\newlog\\/g, "/newlog/");
  const time = fullDate(new Date());

  const guildEntry = logDataEntry(ctx.guild.name, ctx.guild.id);
  const channelEntry = logDataEntry(ctx.channel.name, ctx.channel.id);
  const authorEntry = logDataEntry(ctx.authorUser.username, ctx.authorUser.id);

  const text = `\\newlog\\
${time}
${guildEntry}
${channelEntry}
${authorEntry}
${content}
`;

  await appendFile(LOG_PATH, text, { encoding: "utf8" });
}
