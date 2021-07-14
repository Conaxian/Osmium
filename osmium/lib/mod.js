"use strict";

module.exports = exports = class Mod {
  constructor(name, commands) {
    this.name = name
    this.commands = commands
  }

  *[Symbol.iterator]() {
    for (let command of this.commands) {
      yield command;
    }
  }
}
