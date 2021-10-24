import { Message } from "discord.js";

import { FullContext, Output } from "../context";
import Argument from "../arg";
import Module from "../mod";
import { Perm } from "../perms";
import { forceArray } from "../utils";

type CommandInvoker = (
  ctx: FullContext,
  ...args: any[]
) => AsyncGenerator<Output, void, Message>;

export interface CommandDefinition {
  name: string;
  aliases?: string | string[];
  args?: Argument | Argument[];
  perms?: Perm | Perm[];
  hidden?: boolean;
  invoke: CommandInvoker;
}

interface CommandOptions extends CommandDefinition {
  mod: Module;
}

export default class Command {
  name: string;
  aliases: string[];
  args: Argument[];
  perms: Perm[];
  hidden: boolean;
  invoke: CommandInvoker;
  mod: Module;

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
    this.args = (forceArray(args) ?? []) as Argument[];
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
    for (const arg of this.args) {
      result += " " + arg.displayName;
    }
    return result;
  }
}
