"use strict";

module.exports = exports = class Command {
  constructor({name, aliases}) {
    this.name = name;
    this.aliases = aliases ?? [];
  }

  get calls() {
    return [this.name, ...this.aliases];
  }
}
