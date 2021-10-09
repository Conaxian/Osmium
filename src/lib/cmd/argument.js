"use strict";

const { loadedModules, callNamespace } = require("../loader");
const { mentionId } = require("../utils");

const ACTIVITY_TYPES = [
  "PLAYING",
  "STREAMING",
  "LISTENING",
  "WATCHING",
  "COMPETING",
];

function firstWord(string) {
  return string.match(/^(\S+)/)?.[1];
}

function number(_, string, intOnly = false) {
  const numeral = firstWord(string);
  const remainder = string.replace(numeral, "");
  if (numeral) {
    const number = +numeral;
    const isInvalid =
      (!number && number !== 0) || (intOnly && !Number.isInteger(number));
    if (isInvalid) return numeral;
    return [number, remainder];
  } else {
    return [numeral, remainder];
  }
}

const formatter = {
  async word(_, string) {
    const result = firstWord(string);
    const remainder = string.replace(result, "");
    return [result, remainder];
  },

  async inf_string(_, string) {
    return [string, ""];
  },

  async py_code(_, string) {
    if (string) {
      const code = string
        .match(/^`{0,3}(?:py\s|python\s)?(.*?)`{0,3}$/s)[1]
        .trim();
      return [code, ""];
    } else {
      return [string, ""];
    }
  },

  async js_code(_, string) {
    if (string) {
      const code = string
        .match(/^`{0,3}(?:js\s|javascript\s)?(.*?)`{0,3}$/s)[1]
        .trim();
      return [code, ""];
    } else {
      return [string, ""];
    }
  },

  async int(ctx, string) {
    return number(ctx, string, true);
  },

  async num(ctx, string) {
    return number(ctx, string);
  },

  async command_module(_, string) {
    const name = firstWord(string);
    const remainder = string.replace(name, "");
    if (name) {
      const mod = loadedModules.get(name.toLowerCase());
      if (mod && !mod.hidden) return [mod, remainder];
      const command = callNamespace.get(name.toLowerCase());
      if (command && !command.hidden) return [command, remainder];
      return name;
    } else {
      return [name, remainder];
    }
  },

  async member(ctx, string) {
    const snowflake = firstWord(string);
    const remainder = string.replace(snowflake, "");
    if (snowflake) {
      const id = mentionId(snowflake);
      const result = ctx.guild.members.resolve(id);
      if (!result) return snowflake;
      return [result, remainder];
    } else {
      return [snowflake, remainder];
    }
  },

  async activity_type(_, string) {
    const name = firstWord(string);
    const remainder = string.replace(name, "");
    if (!name) {
      return [name, remainder];
    }
    const activityType = name.toUpperCase();
    if (!ACTIVITY_TYPES.includes(activityType)) {
      return activityType;
    }
    return [activityType, remainder];
  },
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
    const format = formatter[this.format.replace(/-/g, "_")];
    const result = await format(ctx, string);
    if (!Array.isArray(result)) throw new ArgError(this, result);
    return [result[0], result[1].trim()];
  }
};
