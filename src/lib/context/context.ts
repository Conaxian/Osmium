import { Message } from "discord.js";

import Bot from "../bot";
import Perms from "../perms";
import Output from "../cmd/output";
import { LocaleCode } from "../../../config";
import { readJson } from "../dataio";
import { resolveCloc } from "../loc";
import { forceArray } from "../utils";
import cembed, { CembedOptions } from "./cembed";

enum ContextType {
  guild = "GUILD",
  direct = "DIRECT",
  virtual = "VIRTUAL",
}

interface ContextArgs {
  bot: Bot;
  text: string;
  msg: Message;
  type: ContextType;
  prefix: string;
  command: any; // TODO: Add command type
  args: any[];
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
}

interface GuildData {
  config?: GuildConfig;
}

export default class Context {
  bot: Bot;
  text: string;
  msg: Message;
  type: ContextType;
  prefix: string;
  command: any; // TODO: Add command type
  args: any[];
  perms: Perms;
  private result: any; // TODO: Add output type

  constructor({
    bot,
    text,
    msg,
    type,
    prefix,
    command,
    args,
    perms,
  }: ContextArgs) {
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
    return this.type === ContextType.guild ? this.msg.member! : this.msg.author;
  }

  get authorUser() {
    return this.msg.author;
  }

  get authorMember() {
    return this.msg.member;
  }

  get channel() {
    return this.msg.channel;
  }

  get guild() {
    return this.type === ContextType.guild ? this.msg.guild : null;
  }

  async userData(): Promise<UserData | null> {
    return (await readJson("users"))?.[this.author.id];
  }

  async guildData(): Promise<GuildData | null> {
    if (!this.guild) return null;
    return (await readJson("guilds"))?.[this.guild.id];
  }

  // TODO: Move to output
  private async fixMessage(data: any) {
    if (data.content !== undefined) {
      data.content = await resolveCloc(this, data.content);
    }
    data.embeds = forceArray(data.embeds);
    data.files = forceArray(data.files);
    data.components = forceArray(data.components);
    data.stickers = forceArray(data.stickers);
  }

  // TODO: Rewrite output
  output(data: any, reply = true) {
    return new Output(data, reply);
  }

  // TODO: Rewrite resolve
  resolve(data: any, reply = true) {
    this.result ??= new Output(data, reply);
  }

  // TODO: Rewrite out
  async out(output: any) {
    await this.fixMessage(output.data);
    if (output.reply) {
      return await this.msg.reply(output.data);
    } else {
      return await this.channel.send(output.data);
    }
  }

  // TODO: Rewrite edit
  async edit(msg: Message, edited: any) {
    await this.fixMessage(edited.data);
    return await msg.edit(edited.data);
  }

  async embed(options: CembedOptions) {
    return cembed(this, options);
  }
}
