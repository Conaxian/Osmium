"use strict";

const fs = require("fs/promises");
const {Range} = require("./util.js");
const getLocalePath = lang => `../locale/${lang}.json`;
const localeCache = new Map();

async function loadLocale(lang, force=false) {
  if (force || !localeCache.has(lang)) {
    const path = getLocalePath(lang);
    const json = await fs.readFile(path, {encoding: "utf8"});
    const locale = JSON.parse(json);
    localeCache.set(lang, locale);
    return locale;
  } else {
    return localeCache.get(lang);
  }
}

module.exports = exports = class Loc {
  constructor(id) {
    this.id = id;
    this.fValues = [];
  }

  format(...args) {
    this.fValues = args;
    return this;
  }

  async string(lang) {
    let string = await loadLocale(lang);
    const idPath = this.id.split("/");
    idPath.forEach(node => string = string[node]);
    for (let i of new Range(this.fValues.length)) {
      string = string.replaceAll(`{${i}}`, this.fValues[i]);
    }
    return string;
  }
}
