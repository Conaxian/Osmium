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

async function replyPrefix(ctx) {
  if (mentionId(ctx.text) === ctx.bot.user.id) {
    const result = new LocStr("general/current-prefix")
      .format(ctx.prefix);
    ctx.resolve({"content": result});
    return;
  }
}

async function getCmd(ctx) {
  if (ctx.text.startsWith(ctx.prefix) && new Set(ctx.text).size > 1) {
    if (ctx.msg) {
      const callTime = callTimes.get(ctx.author.id);
      if (callTime > new Date() - cmdCooldown) return;
      callTimes.set(ctx.author.id, new Date());
    }

    const originalCall = ctx.text.split(" ")[0].slice(ctx.prefix.length);
    const call = originalCall.toLowerCase().replace(/_/g, "-");
    const cmd = callNamespace.get(call);
    if (!cmd) {
      const result = new LocStr("general/unknown-command")
        .format(ctx.prefix);
      ctx.resolve({"content": result});
      return;
    }

    const argRegex = new RegExp(`^${ctx.prefix}${originalCall}`);
    const argString = ctx.text.replace(argRegex, "").trim();
    const args = await getArgs(ctx, argString);

    ctx.command = cmd;
    ctx.args = args;
  }
}

async function getArgs(ctx, argString) {
  return [];
}

const parseTypes = {
  async guild({bot, text, msg}) {
    const guildConfig = DataIO.read("guilds")?.[msg.guild.id];
    const prefix = guildConfig?.config?.prefix ?? defaultPrefix;
    const ctx = new Context({bot, text, msg, type: "guild", prefix});

    await replyPrefix(ctx);
    if (ctx.result) return ctx;

    await getCmd(ctx);
    return ctx;
  },

  async dm({bot, text, msg}) {
    const prefix = defaultPrefix;
    const ctx = new Context({bot, text, msg, type: "dm", prefix});

    await replyPrefix(ctx);
    if (ctx.result) return ctx;

    await getCmd(ctx);
    return ctx;
  },

  async virtual({bot, text}) {
    const prefix = defaultPrefix;
    const ctx = new Context({bot, text, type: "virtual", prefix});

    await replyPrefix(ctx);
    if (ctx.result) return ctx;

    await getCmd(ctx);
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
    case "GUILD_PUBLIC_THREAD":
    case "GUILD_PRIVATE_THREAD":
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
