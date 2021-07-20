"use strict";

module.exports = exports = class Command {
  constructor({name, aliases, args, invoke}) {
    this.name = name;
    this.aliases = aliases ?? [];
    this.args = args ?? [];
    this.invoke = invoke;
  }

  get calls() {
    return [this.name, ...this.aliases];
  }
}
