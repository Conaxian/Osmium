"use strict";

const Output = require("./output");

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
    if (output.data?.content?.cstring) {
      output.data.content = await output.data.content.cstring(this);
    }
    if (output.reply) {
      await this.msg.reply(output.data);
    } else {
      await this.channel.send(output.data);
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

    for (field of options.fields ?? []) {
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
  }
}
