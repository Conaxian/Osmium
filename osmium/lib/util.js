"use strict";

const {exec} = require("child_process");
const {promisify} = require("util");

const MAX_EMBED_DESC_LENGTH = 4096;

class Range {
  constructor(startOrStop, stop, step) {
    this.start = (stop !== undefined) ? startOrStop : 0;
    this.stop = (stop === undefined) ? startOrStop : stop;
    this.step = step ?? 1;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i < this.stop; i += this.step) {
      yield i;
    }
  }
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function title(string) {
  let result = "";
  for (let word of string.split(/( |\t|\n|-)/g)) {
    result += capitalize(word);
  }
  return result;
}

function forceArray(obj) {
  if (obj && !Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}

function mentionId(mention="") {
  if (+mention) return mention;
  return mention.match(/^<(?:@[!&]?|#)(\d+)>$/)?.[1] ?? null;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeCode(string) {
  return string.replace(/`/g, "´");
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function safeAccess(obj, path, defaultIsArray=false) {
  path = path.split("/");
  for (let property of path) {
    const defaultValue = defaultIsArray ? [] : {}
    if (obj[property] === undefined) obj[property] = defaultValue;
    obj = obj[property];
  }
  return obj;
}

const shell = promisify(exec);

module.exports = exports = {
  MAX_EMBED_DESC_LENGTH,
  Range,
  capitalize,
  title,
  forceArray,
  mentionId,
  escapeRegExp,
  escapeCode,
  randInt,
  safeAccess,
  shell
};
