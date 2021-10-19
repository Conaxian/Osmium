import Context from "../context";
import { kebabToCamel } from "../utils";
import { FormatName } from "./types";
import formatters from "./formatters";

export class ArgError extends Error {
  arg: Argument;
  value: any;

  constructor(arg: Argument, value: any) {
    super();
    this.name = "ArgError";
    this.arg = arg;
    this.value = value;
  }
}

export default class Argument {
  displayName: string;
  formatName: string;

  constructor(displayName: string, formatName: string) {
    this.displayName = displayName;
    this.formatName = formatName;
  }

  get name() {
    return this.displayName.match(/^[<\[](.+)[>\]]$/)![1];
  }

  get optional() {
    return /^\[.+\]$/.test(this.displayName);
  }

  get formatterName() {
    return kebabToCamel(this.formatName) as FormatName;
  }

  get formatter() {
    return formatters[this.formatterName];
  }

  async parse(ctx: Context, string: string) {
    const result = await this.formatter({ ctx, string });

    if (result.code === "INVALID") {
      throw new ArgError(this, result.value);
    }

    return result;
  }
}
