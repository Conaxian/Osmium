"use strict";

const Log = require("../log");
const log = new Log("MsgParser");
const DataIO = require("../dataio");
const {mentionId} = require("../util");
const LocStr = require("../locale");

const {prefix: defaultPrefix, cmdCooldown} = require("../../config.json");
const callTimes = new Map();

async function replyPrefix(bot, text, prefix) {
  if (mentionId(text) === bot.user.id) {
    return new LocStr("general/current-prefix").format(prefix);
  }
}

async function getCmd(text, msg, prefix) {
  if (text.startsWith(prefix) && new Set(text).size > 1) {
    if (msg) {
      const callTime = callTimes.get(msg.author.id);
      if (callTime > new Date() - cmdCooldown) return;
      callTimes.set(msg.author.id, new Date());
    }

    const originalCall = text.split(" ")[0].slice(prefix.length);
    const call = originalCall.toLowerCase().replace(/_/g, "-");
  }
}

const parseTypes = {
  async guild({bot, text, msg}) {
    const guildConfig = DataIO.read("guilds")?.[msg.guild.id];
    const prefix = guildConfig?.config?.prefix ?? defaultPrefix;

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) return await reply.cstring(msg);

    const command = await getCmd(text, msg, prefix);
    return command;
  },

  async dm({bot, text, msg}) {
    const prefix = defaultPrefix;

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) return await reply.cstring(msg);

    const command = await getCmd(text, msg, prefix);
    return command;
  },

  async virtual({bot, text}) {
    const prefix = defaultPrefix;

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) return reply;

    const command = await getCmd(text, null, prefix);
    return command;
  }
};

module.exports = exports = async function parse({bot, text, msg}) {
  const ignoreMsg = msg?.author?.bot || msg?.system;
  if (!text || ignoreMsg) return;
  let type = null;

  switch (msg?.channel?.type) {
    case undefined:
      type = "virtual"; break;
    case "GUILD_TEXT":
      type = "guild"; break;
    case "DM": case "GROUP_DM":
      type = "dm"; break;
    default:
      log.error(`Invalid channel type: ${msg.channel.type}`);
      return;
  }

  const ctx = await parseTypes[type]({bot, text, msg});
  return ctx;
}
