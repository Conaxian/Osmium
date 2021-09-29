"use strict";

const fs = require("fs/promises");
const { fullDate } = require("./timestamp");

const getJsonPath = file => `data/${file}.json`;
const logPath = "data/log.txt";
const cache = new Map();

module.exports = exports = {
  async read(file) {
    if (cache.has(file)) return cache.get(file);
    const path = getJsonPath(file);
    let object;

    try {
      const json = await fs.readFile(path, { encoding: "utf8" });
      object = JSON.parse(json);
    } catch (err) {
      object = {};
    }

    cache.set(file, object);
    return object;
  },

  async write(file, object) {
    cache.set(file, object);
    const path = getJsonPath(file);
    const json = JSON.stringify(object, null, 2);
    await fs.writeFile(path, json, { encoding: "utf8" });
  },

  async logMessage(ctx) {
    const content = ctx.text.replace(/\\newlog\\/g, "/newlog/");
    const time = fullDate(new Date());

    const guildName = ctx.guild.name.replace(/\\\\/g, "//");
    const guild = `${guildName}\\\\(${ctx.guild.id})`;

    const channelName = ctx.channel.name.replace(/\\\\/g, "//");
    const channel = `${channelName}\\\\(${ctx.channel.id})`;

    const authorName = ctx.authorUser.username.replace(/\\\\/g, "//");
    const author = `${authorName}\\\\(${ctx.author.id})`;

    const text = `\\newlog\\
${time}
${guild}
${channel}
${author}
${content}
`;

    await fs.appendFile(logPath, text, { encoding: "utf8" });
  }
};
