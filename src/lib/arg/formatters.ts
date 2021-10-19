import { loadedModules, callNamespace } from "../mod";
import { ActivityTypes } from "../../types";
import { mentionId } from "../utils";

import { Formatters } from "./types";
import { resultSuccess, resultMissing, resultInvalid } from "./types";

function firstWord(string: string) {
  return string.match(/^(\S+)/)?.[1];
}

function matchCode(string: string, pattern: RegExp) {
  if (!string) return resultMissing();

  const code = string.match(pattern)![1].trim();
  return resultSuccess(code, "");
}

function number(string: string, intOnly = false) {
  const numeral = firstWord(string);
  if (!numeral) return resultMissing();

  const remainder = string.replace(numeral, "");

  const number = +numeral;
  const isInvalid =
    (!number && number !== 0) || (intOnly && !Number.isInteger(number));

  if (isInvalid) return resultInvalid(numeral);
  return resultSuccess(number, remainder);
}

const formatters: Formatters = {
  async word({ string }) {
    const result = firstWord(string);
    if (!result) return resultMissing();

    const remainder = string.replace(result, "");

    return resultSuccess(result, remainder);
  },

  async infString({ string }) {
    if (!string) return resultMissing();
    return resultSuccess(string, "");
  },

  async pyCode({ string }) {
    return matchCode(string, /^`{0,3}(?:py\s|python\s)?(.*?)`{0,3}$/s);
  },

  async jsCode({ string }) {
    return matchCode(string, /^`{0,3}(?:js\s|javascript\s)?(.*?)`{0,3}$/s);
  },

  async int({ string }) {
    return number(string, true);
  },

  async num({ string }) {
    return number(string, false);
  },

  async commandModule({ string }) {
    const name = firstWord(string);
    if (!name) return resultMissing();

    const remainder = string.replace(name, "");

    const lowerName = name.toLowerCase();

    const mod = loadedModules.get(lowerName);
    if (mod && !mod.hidden) return resultSuccess(mod, remainder);

    const command = callNamespace.get(lowerName);
    if (command && !command.hidden) return resultSuccess(command, remainder);

    return resultInvalid(name);
  },

  async member({ ctx, string }) {
    const mention = firstWord(string);
    if (!mention) return resultMissing();

    const remainder = string.replace(mention, "");

    const id = mentionId(mention);
    const result = ctx.guild?.members.resolve(id);

    if (!result) return resultInvalid(id);
    return resultSuccess(result, remainder);
  },

  async activityType({ string }) {
    const name = firstWord(string);
    if (!name) return resultMissing();

    const remainder = string.replace(name, "");

    const upperName = name.toUpperCase();
    const activityTypes = Object.keys(ActivityTypes);

    if (!activityTypes.includes(upperName)) {
      return resultInvalid(name);
    }

    return resultSuccess(upperName, remainder);
  },
};

export default formatters;
