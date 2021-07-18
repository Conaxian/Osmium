"use strict";

module.exports = exports = class Output {
  constructor(type, value, options={}, reply=true) {
    this.type = type;
    this.value = value;
    this.options = options;
    this.reply = reply;
  }
}
