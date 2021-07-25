"use strict";

const Output = require("./output");
const Timestamp = require("../timestamp");
const DataIO = require("../dataio");
const {MessageEmbed} = require("discord.js");
const {cembedFooterIcon, cembedColor} = require("../../config.json");

module.exports = exports = class Context {
  constructor({bot, text, msg, type, prefix, command, args, perms}) {
    this.bot = bot;
    this.text = text;
    if (type !== "virtual") {
      this.msg = msg;
      this.author = (type === "guild") ? msg.member : msg.author;
      this.channel = msg.channel;
      if (type === "guild") this.guild = msg.guild;
    }
    this.type = type;
    this.prefix = prefix;
    this.command = command;
    this.args = args;
    this.perms = perms;
  }

  async init() {
    this.userConfig = await DataIO.read("user")?.[this.author.id];
    if (this.type === "guild") {
      this.guildConfig = await DataIO.read("guilds")?.[this.guild.id];
    }
  }

  output(data, reply=true) {
    return new Output(data, reply);
  }

  resolve(data, reply=true) {
    if (!this.result) this.result = new Output(data, reply);
  }

  async out(output) {
    const data = output.data;
    if (data?.content?.cstring) {
      data.content = await data.content.cstring(this);
    }

    if (data.embeds && !Array.isArray(data.embeds)) {
      data.embeds = [data.embeds];
    }
    if (data.files && !Array.isArray(data.files)) {
      data.files = [data.files];
    }
    if (data.components && !Array.isArray(data.components)) {
      data.components = [data.components];
    }
    if (data.stickers && !Array.isArray(data.stickers)) {
      data.stickers = [data.stickers];
    }

    if (output.reply) {
      return await this.msg.reply(data);
    } else {
      return await this.channel.send(data);
    }
  }

  async edit(msg, edited) {
    const data = edited.data;
    if (data?.content?.cstring) {
      data.content = await data.content.cstring(this);
    }

    if (data.embeds && !Array.isArray(data.embeds)) {
      data.embeds = [data.embeds];
    }
    if (data.files && !Array.isArray(data.files)) {
      data.files = [data.files];
    }
    if (data.components && !Array.isArray(data.components)) {
      data.components = [data.components];
    }
    if (data.stickers && !Array.isArray(data.stickers)) {
      data.stickers = [data.stickers];
    }

    return await msg.edit(data);
  }

  async cembed(options) {
    options.description = options.text;
    if (options.title?.cstring) {
      options.title = await options.title.cstring(this);
    }
    if (options.description?.cstring) {
      options.description = await options.description.cstring(this);
    }

    if (options.fields && !Array.isArray(options.fields)) {
      options.fields = [options.fields];
    }
    for (let field of options.fields ?? []) {
      if (field.name?.cstring) {
        field.name = await field.name.cstring(this);
      }
      if (field.value?.cstring) {
        field.value = await field.value.cstring(this);
      }
    }

    if (options.author?.name?.cstring) {
      options.author.name = await options.author.name.cstring(this);
    }
    if (options.footer?.text?.cstring) {
      options.footer.text = await options.footer.tetx.cstring(this);
    }

    if (!options.footer) {
      options.footer = {
        "text": `${Timestamp.HHMM(new Date())} UTC`,
        "iconURL": cembedFooterIcon
      };
    }
    if (!options.color) {
      options.color = this?.author?.displayColor || cembedColor;
    }
    return new MessageEmbed(options);
  }
}
