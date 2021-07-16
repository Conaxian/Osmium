"use strict";

module.exports = exports = class Command {
  constructor({name, aliases, invoker}) {
    this.name = name;
    this.aliases = aliases ?? [];
    this.invoker = invoker;
  }

  get calls() {
    return [this.name, ...this.aliases];
  }
}
