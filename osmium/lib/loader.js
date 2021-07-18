"use strict";

const loadedModules = new Map();
const callNamespace = new Map();

module.exports = exports = {
  async load(name) {
    const mod = require(`../mods/${name}`);
    loadedModules.set(name, mod);
  }
};
