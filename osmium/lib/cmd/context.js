"use strict";

const Output = require("./output");
const Timestamp = require("../timestamp");
const DataIO = require("../dataio");
const Log = require("../log");
const log = new Log("Context");
const {MessageEmbed} = require("discord.js");
const {cembedColors, cembedIcons} = require("../../config.json");

function toArray(obj) {
  if (obj && !Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}

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
    this.userData = (await DataIO.read("user"))?.[this.author.id];
    if (this.type === "guild") {
      this.guildData = (await DataIO.read("guilds"))?.[this.guild.id];
    }
  }

  async #resolveLoc(obj) {
    if (obj?.cstring) {
      obj = await obj.cstring(this);
    }
    return obj;
  }

  async #fixMessage(data) {
    data.content = await this.#resolveLoc(data.content);
    data.embeds = toArray(data.embeds);
    data.files = toArray(data.files);
    data.components = toArray(data.components);
    data.stickers = toArray(data.stickers);
  }

  output(data, reply=true) {
    return new Output(data, reply);
  }

  resolve(data, reply=true) {
    this.result ??= new Output(data, reply);
  }

  async out(output) {
    await this.#fixMessage(output.data);
    if (output.reply) {
      return await this.msg.reply(output.data);
    } else {
      return await this.channel.send(output.data);
    }
  }

  async edit(msg, edited) {
    await this.#fixMessage(edited.data);
    return await msg.edit(edited.data);
  }

  async cembed(options) {
    options.description = options.text;
    options.title = await this.#resolveLoc(options.title);
    options.description = await this.#resolveLoc(options.description);
    options.fields = toArray(options.fields);

    for (let field of options.fields ?? []) {
      field.name = await this.#resolveLoc(field.name);
      field.value = await this.#resolveLoc(field.value);
    }

    if (options.author)
      options.author.name = await this.#resolveLoc(options.author.name);
    if (options.footer)
      options.footer.text = await this.#resolveLoc(options.footer.text);

    options.footer ??= {
      "text": `${Timestamp.HHMM(new Date())} UTC`,
    };

    if (options.type) {
      const validType = ["ok", "error", "info"].includes(options.type);
      if (validType) {
        options.color ??= cembedColors[options.type];
        options.footer.iconURL ??= cembedIcons[options.type];
      } else {
        log.error(`Invalid embed type: '${options.type}'`);
      }
    }

    options.color ??= this?.author?.displayColor || cembedColors.default;
    options.footer.iconURL ??= cembedIcons.default;
    return new MessageEmbed(options);
  }
}
