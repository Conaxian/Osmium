"use strict";

const Log = require("../log");
const log = new Log("Perms");
const {forceArray, arraysEqualDetails} = require("../util");
const {FLAGS: PERMS} = require("discord.js").Permissions;
const {debug} = require("../../../config.json");

const ALL_PERMS = Object.keys(PERMS).map(perm => {
  return perm.toLowerCase().replace(/_/g, "-");
});

const PERM_CATEGORIES = {
  administration: [
    "administrator",
    "manage-guild",
    "manage-roles",
    "manage-channels",
    "manage-threads",
    "manage-emojis-and-stickers",
    "manage-webhooks",
    "view-audit-log",
    "view-guild-insights"
  ],
  moderation: [
    "kick-members",
    "ban-members",
    "mute-members",
    "deafen-members",
    "move-members",
    "manage-messages",
    "change-nickname",
    "manage-nicknames",
    "create-instant-invite",
    "mention-everyone"
  ],
  "text-channels": [
    "view-channel",
    "send-messages",
    "read-message-history",
    "use-public-threads",
    "use-private-threads",
    "embed-links",
    "attach-files",
    "add-reactions",
    "use-external-emojis",
    "use-external-stickers",
    "send-tts-messages",
    "use-application-commands"
  ],
  "voice-channels": [
    "connect",
    "speak",
    "stream",
    "use-vad",
    "request-to-speak",
    "priority-speaker"
  ]
}

if (debug) {
  const categorizedPerms = [].concat(...Object.values(PERM_CATEGORIES));
  const comparison = arraysEqualDetails(ALL_PERMS, categorizedPerms);
  if (!comparison.result) {
    log.debug("Some perms aren't categorized - Mismatching values: " +
    `${comparison.first} - ${comparison.second}`);
  }
}

class Perms {
  constructor(dev=false, enforced=true, guildPerms={}, channelPerms={}) {
    this.dev = dev;
    this.enforced = enforced;
    this.guildPerms = guildPerms;
    this.channelPerms = channelPerms;
  }

  has(perms) {
    if (this.dev || !this.enforced) return true;
    perms = forceArray(perms);

    let result = true;
    for (let perm of perms) {
      perm = perm.toUpperCase().replace(/-/g, "_");
      if (perm === "DEVELOPER") return false;
      if (this.guildPerms.has("ADMINISTRATOR", false)) continue;
      if (this.channelPerms) result = this.channelPerms.has(perm, false);
      else result = this.guildPerms.has(perm, false);
      if (!result) break;
    }
    return result;
  }
}

module.exports = exports = {ALL_PERMS, PERM_CATEGORIES, Perms};
