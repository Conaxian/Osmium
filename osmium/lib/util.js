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

function mentionId(mention) {
  if (+mention) return mention;
  return mention.match(/^<(?:@[!&]?|#)(\d+)>$/)?.[1] ?? null;
}

module.exports = exports = {Range, mentionId};
