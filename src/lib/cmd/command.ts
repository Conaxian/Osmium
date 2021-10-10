import { Message } from "discord.js";

import Context from "../context";
import { Perm } from "../perms";
import { forceArray } from "../utils";

export type CommandInvoker = (
  ctx: Context,
  ...args: any[]
) => Generator<any, void, Message>; // TODO: Add output type

export interface CommandDefinition {
  name: string;
  aliases?: string | string[];
  args?: any | any[]; // TODO: Add argument type
  perms?: Perm | Perm[];
  hidden?: boolean;
  invoke: CommandInvoker;
}

interface CommandOptions extends CommandDefinition {
  mod: any; // TODO: Add mod type
}

export default class Command {
  name: string;
  aliases: string[];
  args: any[]; // TODO: Add argument type
  perms: Perm[];
  hidden: boolean;
  invoke: CommandInvoker;
  mod: any; // TODO: Add mod type

  constructor({
    name,
    aliases,
    args,
    perms,
    hidden,
    invoke,
    mod,
  }: CommandOptions) {
    this.name = name;
    this.aliases = (forceArray(aliases) ?? []) as string[];
    this.args = forceArray(args) ?? [];
    this.perms = (forceArray(perms) ?? []) as Perm[];
    this.hidden = hidden ?? false;
    this.invoke = invoke;
    this.mod = mod;
  }

  get calls() {
    return [this.name, ...this.aliases];
  }

  get syntax() {
    let result = this.name;
    for (let arg of this.args) {
      result += " " + arg.displayName;
    }
    return result;
  }
}
