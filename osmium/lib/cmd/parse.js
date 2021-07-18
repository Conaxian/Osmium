"use strict";

const Log = require("../log");
const log = new Log("MsgParser");
const DataIO = require("../dataio");
const Context = require("./context");
const {mentionId} = require("../util");
const {LocStr} = require("../locale");

const {prefix: defaultPrefix, cmdCooldown} = require("../../config.json");
const {callNamespace} = require("../loader");
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
    const cmd = callNamespace.get(call);
    if (!cmd) return new LocStr("general/unknown-command").format(prefix);
    return cmd.name;
  }
}

const parseTypes = {
  async guild({bot, text, msg}) {
    const guildConfig = DataIO.read("guilds")?.[msg.guild.id];
    const prefix = guildConfig?.config?.prefix ?? defaultPrefix;
    const ctx = new Context({bot, text, msg, type: "guild", prefix});

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) {
      ctx.resolve("locstr", reply);
      return ctx;
    }

    const command = await getCmd(text, msg, prefix);
    if (command && !command instanceof LocStr) {
      ctx.command = command;
    } else if (command) {
      ctx.resolve("locstr", command);
    }
    return ctx;
  },

  async dm({bot, text, msg}) {
    const prefix = defaultPrefix;
    const ctx = new Context({bot, text, msg, type: "dm", prefix});

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) {
      ctx.resolve("locstr", reply);
      return ctx;
    }

    const command = await getCmd(text, msg, prefix);
    if (command && !command instanceof LocStr) {
      ctx.command = command;
    } else {
      ctx.resolve("locstr", command);
    }
    return ctx;
  },

  async virtual({bot, text}) {
    const prefix = defaultPrefix;
    const ctx = new Context({bot, text, type: "virtual", prefix});

    const reply = await replyPrefix(bot, text, prefix);
    if (reply) {
      ctx.resolve("locstr", reply);
      return ctx;
    }

    const command = await getCmd(text, null, prefix);
    if (command && !command instanceof LocStr) {
      ctx.command = command;
    } else {
      ctx.resolve("locstr", command);
    }
    return ctx;
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
