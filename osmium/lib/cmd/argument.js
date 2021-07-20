"use strict";

const formatter = {
  async word(ctx, string) {
    const result = string.match(/^(\S+)/)?.[1];
    const remainder = string.replace(result, "");
    return [result, remainder];
  }
};

module.exports = exports = class Argument {
  constructor(fullname, format) {
    this.fullname = fullname;
    this.format = format;
  }

  get name() {
    return this.fullname.match(/^[<\[](.+)[>\]]$/)[1];
  }

  get optional() {
    return this.fullname.test(/^\[.+\]$/);
  }

  async parse(ctx, string) {
    const result = await formatter[this.format](ctx, string);
    return [result[0], result[1].trim()];
  }
}
