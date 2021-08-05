"use strict";

const Mod = require("./mod");
const Command = require("./cmd/command");
const {preloadModules} = require("../config.json");

module.exports = exports = {
  loadedModules: new Map(),
  callNamespace: new Map(),

  async load(name) {
    const modData = require(`../mods/${name}`);
    const mod = new Mod(name, []);
    this.loadedModules.set(name, mod);

    for (let cmd of modData.commands) {
      const data = {...cmd, mod};
      const command = new Command(data);
      for (let call of command.calls) {
        this.callNamespace.set(call, command);
      }
      mod.commands.push(command);
    }
  }
};

for (let mod of preloadModules) {
  exports.load(mod);
}
