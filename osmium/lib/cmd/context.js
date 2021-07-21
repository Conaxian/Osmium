"use strict";

const Output = require("./output");
const Timestamp = require("../timestamp");
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
    }
    this.type = type;
    this.prefix = prefix;
    this.command = command;
    this.args = args;
    this.perms = perms;
  }

  output(data, reply=true) {
    return new Output(data, reply);
  }

  resolve(data, reply=true) {
    this.result = new Output(data, reply);
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
      await this.msg.reply(data);
    } else {
      await this.channel.send(data);
    }
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
    if (!options.color) options.color = cembedColor;
    return new MessageEmbed(options);
  }
}
