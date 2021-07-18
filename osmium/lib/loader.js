"use strict";

const Mod = require("./mod");
const Command = require("./cmd/command");
const {preloadModules} = require("../config.json");

module.exports = exports = {
  loadedModules: new Map(),
  callNamespace: new Map(),

  async load(name) {
    let mod = require(`../mods/${name}`);
    const commands = [];
    for (let cmd of mod.commands) {
      const command = new Command(cmd.data);
      for (let call of command.calls) {
        this.callNamespace.set(call, command);
      }
      commands.push(command);
    }
    mod = new Mod(name, commands);
    this.loadedModules.set(name, mod);
  }
};

for (let mod of preloadModules) {
  exports.load(mod);
}
