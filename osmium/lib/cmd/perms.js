"use strict";

module.exports = exports = class Perms {
  constructor(dev=false, enforced=true, guildPerms={}, channelPerms={}) {
    this.dev = dev;
    this.enforced = enforced;
    this.guildPerms = guildPerms;
    this.channelPerms = channelPerms;
  }

  has(perms) {
    if (this.dev || !this.enforced) return true;
    if (!Array.isArray(perms)) perms = [perms];

    let result = true;
    for (let perm of perms) {
      perm = perm.toLowerCase();
      if (this.channelPerms) result = this.channelPerms.has(perm);
      else result = this.guildPerms.has(perm);
      if (!result) break;
    }
    return result;
  }
}
