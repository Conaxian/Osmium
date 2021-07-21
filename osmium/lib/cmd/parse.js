"use strict";

const Log = require("../log");
const log = new Log("MsgParser");
const DataIO = require("../dataio");
const Context = require("./context");
const {mentionId, escapeRegExp} = require("../util");
const {LocStr} = require("../locale");

const {prefix: defaultPrefix, cmdCooldown} = require("../../config.json");
const {callNamespace} = require("../loader");
const callTimes = new Map();

async function replyPrefix(ctx) {
  if (mentionId(ctx.text) === ctx.bot.user.id) {
    const result = new LocStr("parser/current-prefix")
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
    ctx.command = callNamespace.get(call);
    if (!ctx.command) {
      const result = new LocStr("parser/unknown-command")
        .format(ctx.prefix);
      ctx.resolve({"content": result});
      return;
    }

    const escPrefix = escapeRegExp(ctx.prefix);
    const escOriginalCall = escapeRegExp(originalCall);
    const argRegex = new RegExp(`^${escPrefix}${escOriginalCall}`);
    const argString = ctx.text.replace(argRegex, "").trim();
    ctx.args = await getArgs(ctx, argString);
  }
}

async function getArgs(ctx, argString) {
  const args = {};
  for (let argName in ctx.command.args) {
    const arg = ctx.command.args[argName];
    const result = await arg.parse(ctx, argString);
    if (!result[0]) {
      if (arg.optional) break;
      const result = new LocStr("parser/missing-arg")
        .format(arg.fullname);
      ctx.resolve({"content": result});
      break;
    }
    [args[argName], argString] = result;
  }
  return args;
}

const parseTypes = {
  async guild({bot, text, msg}) {
    const guildConfig = await DataIO.read("guilds")?.[msg.guild.id];
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
