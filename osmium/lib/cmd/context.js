"use strict";

const Output = require("../output");

module.exports = exports = class Context {
  constructor({bot, text, msg, type, prefix, command, args}) {
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
  }

  resolve(data, reply=true) {
    this.result = new Output(data, reply);
  }
}
