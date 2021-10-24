import { Message, TextChannel } from "discord.js";

import Bot from "../bot";
import Perms from "../perms";
import Command from "../cmd/command";
import { Localizable } from "../loc";
import { readJson, writeJson } from "../dataio";
import { notNullish } from "../utils";
import { LocaleCode, EmbedType } from "../../types";

import cembed, { CembedOptions } from "./cembed";
import output, { Output, OutputOptions } from "./output";

export enum ContextType {
  guild = "GUILD",
  direct = "DIRECT",
  virtual = "VIRTUAL",
}

interface ContextOptions {
  bot: Bot;
  text: string;
  msg?: Message;
  type: ContextType;
  prefix: string;
  command?: Command;
  args?: ArgsObject;
  perms: Perms;
}

interface UserConfig {
  language?: LocaleCode;
}

interface UserData {
  config?: UserConfig;
}

interface GuildConfig {
  language?: LocaleCode;
  prefix?: string;
}

interface GuildData {
  config?: GuildConfig;
}

export interface ArgsObject {
  [key: string]: any;
}

export default class Context {
  bot: Bot;
  text: string;
  msg?: Message;
  type: ContextType;
  prefix: string;
  command?: Command;
  args?: ArgsObject;
  perms: Perms;
  protected result!: Output;

  constructor({
    bot,
    text,
    msg,
    type,
    prefix,
    command,
    args,
    perms,
  }: ContextOptions) {
    this.bot = bot;
    this.text = text;
    this.msg = msg;
    this.type = type;
    this.prefix = prefix;
    this.command = command;
    this.args = args;
    this.perms = perms;
  }

  get author() {
    if (this.type === ContextType.virtual) return;
    return this.type === ContextType.guild
      ? this.msg!.member!
      : this.msg!.author;
  }

  get authorUser() {
    notNullish(this.msg);
    return this.msg.author;
  }

  get authorMember() {
    notNullish(this.msg);
    return this.msg.member;
  }

  get channel(): TextChannel {
    notNullish(this.msg);
    return this.msg.channel as TextChannel;
  }

  get guild() {
    notNullish(this.msg);
    return this.type === ContextType.guild ? this.msg.guild : null;
  }

  get resolved() {
    return !!this.result;
  }

  async userData(): Promise<UserData | null> {
    notNullish(this.author);
    return (await readJson("users"))?.[this.author.id];
  }

  async guildData(): Promise<GuildData | null> {
    if (!this.guild) return null;
    return (await readJson("guilds"))?.[this.guild.id];
  }

  async setGuildData(newData: GuildData) {
    if (!this.guild) return null;

    const guildsData = await readJson("guild");
    if (!guildsData[this.guild.id]) guildsData[this.guild.id] = {};
    guildsData[this.guild.id] = newData;

    return await writeJson("guilds", guildsData);
  }

  async output(data: OutputOptions) {
    return await output(this, data);
  }

  async resolve(data: OutputOptions) {
    this.result ??= await output(this, data);
  }

  async resolveNow(data: OutputOptions) {
    const output = await this.output(data);
    return await this.out(output);
  }

  private async genericEmbedShortcut(
    text: string | Localizable,
    type: EmbedType,
  ) {
    const embed = await this.embed({ text, type });
    await this.resolve({ embeds: embed });
  }

  async ok(text: string | Localizable) {
    await this.genericEmbedShortcut(text, "ok");
  }

  async error(text: string | Localizable) {
    await this.genericEmbedShortcut(text, "error");
  }

  async warn(text: string | Localizable) {
    await this.genericEmbedShortcut(text, "warn");
  }

  async out(output: Output) {
    notNullish(this.msg);

    if (output.reply) {
      return await this.msg.reply(output.data);
    } else {
      return await this.channel.send(output.data);
    }
  }

  async edit(msg: Message, edited: Output) {
    return await msg.edit(edited.data);
  }

  async finalize() {
    await this.out(this.result);
  }

  async embed(options: CembedOptions) {
    return await cembed(this, options);
  }
}

export type FullContext = Required<Context> & Context;

export function declareFull(ctx: Context): asserts ctx is FullContext {}
