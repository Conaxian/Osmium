"use strict";

const {loadedModules, callNamespace} = require("../loader");

const formatter = {
  async word(ctx, string) {
    const result = string.match(/^(\S+)/)?.[1];
    const remainder = string.replace(result, "");
    return [result, remainder];
  },

  async command_module(ctx, string) {
    const name = string.match(/^(\S+)/)?.[1];
    const remainder = string.replace(name, "");
    if (name) {
      const mod = loadedModules.get(name.toLowerCase());
      if (mod) return [mod, remainder];
      const command = callNamespace.get(name.toLowerCase());
      if (command) return [command, remainder];
      return name;
    } else {
      return [name, remainder];
    }
  }
};

class ArgError extends Error {
  constructor(arg, value) {
    super();
    this.name = "ArgError";
    this.arg = arg;
    this.value = value;
  }
}

module.exports = exports = class Argument {
  constructor(fullname, format) {
    this.fullname = fullname;
    this.format = format;
  }

  get name() {
    return this.fullname.match(/^[<\[](.+)[>\]]$/)[1];
  }

  get optional() {
    return /^\[.+\]$/.test(this.fullname);
  }

  async parse(ctx, string) {
    const result = await formatter[this.format](ctx, string);
    if (!Array.isArray(result)) throw new ArgError(this, result);
    return [result[0], result[1].trim()];
  }
}
