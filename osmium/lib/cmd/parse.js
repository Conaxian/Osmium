"use strict";

const Log = require("../log.js");
const log = new Log("MsgParser");

const {prefix} = require("../../config.json");

const parseParts = {
  async getCmd(text) {
    return
  }
};

const parseTypes = {
  async guild({text, msg}) {
    return [text, "guild"];
  },

  async dm({text, msg}) {
    return [text, "dm"];
  },

  async virtual({text, msg}) {
    return [text, "virtual"];
  }
};

module.exports = exports = async function parse({text, msg}) {
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

  const ctx = await parseTypes[type]({text, msg});
  return ctx;
}
