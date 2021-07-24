"use strict";

module.exports = exports = class Command {
  constructor({name, aliases=[], args=[], perms=[], invoke}) {
    this.name = name;
    this.aliases = aliases;
    this.args = args;
    this.perms = perms;
    this.invoke = invoke;
  }

  get calls() {
    return [this.name, ...this.aliases];
  }

  get syntax() {
    let result = this.name;
    for (let arg of this.args) {
      result += " " + arg.fullname;
    }
    return result;
  }
}
