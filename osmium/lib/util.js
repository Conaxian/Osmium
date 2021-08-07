"use strict";

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
  return string[0].toUpperCase() + string.slice(1);
}

function title(string) {
  let result = "";
  for (let word of string.split(/( |\t|\n|-)/g)) {
    result += capitalize(word);
  }
  return result;
}

function mentionId(mention="") {
  if (+mention) return mention;
  return mention.match(/^<(?:@[!&]?|#)(\d+)>$/)?.[1] ?? null;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

module.exports = exports = {
  Range,
  capitalize,
  title,
  mentionId,
  escapeRegExp,
  randInt,
  safeAccess
};
