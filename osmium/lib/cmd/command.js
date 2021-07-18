"use strict";

module.exports = exports = class Command {
  constructor({name, aliases, invoke}) {
    this.name = name;
    this.aliases = aliases ?? [];
    this.invoke = invoke;
  }

  get calls() {
    return [this.name, ...this.aliases];
  }
}
