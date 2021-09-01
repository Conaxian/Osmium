"use strict";

module.exports = exports = class Mod {
  constructor(name, commands, hidden=false) {
    this.name = name;
    this.commands = commands;
    this.hidden = hidden;
  }

  *[Symbol.iterator]() {
    for (let command of this.commands) {
      yield command;
    }
  }
}
