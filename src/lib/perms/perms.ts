import { Permissions, PermissionString } from "discord.js";
import { forceArray } from "../utils";
import { Perm } from "./perm-types";

export default class Perms {
  dev: boolean;
  enforced: boolean;
  guildPerms: Permissions | null;
  channelPerms: Permissions | null;

  constructor(
    dev = false,
    enforced = true,
    guildPerms?: Permissions,
    channelPerms?: Permissions,
  ) {
    this.dev = dev;
    this.enforced = enforced;
    this.guildPerms = guildPerms ?? null;
    this.channelPerms = channelPerms ?? null;
  }

  has(perms: Perm | Perm[]) {
    if (this.dev || !this.enforced) return true;
    perms = forceArray(perms);

    let result = true;

    for (const permName of perms) {
      const perm = permName.toUpperCase().replace(/-/g, "_") as
        | PermissionString
        | "DEVELOPER";

      if (perm === "DEVELOPER") return false;
      if (this.guildPerms?.has("ADMINISTRATOR", false)) continue;

      if (this.channelPerms) {
        result = this.channelPerms.has(perm, false);
      } else {
        result = this.guildPerms?.has(perm, false)!;
      }

      if (!result) break;
    }

    return result;
  }
}
