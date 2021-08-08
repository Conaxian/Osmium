"use strict";

const fs = require("fs/promises");
const {Range} = require("./util");
const DataIO = require("./dataio");
const Context = require("./cmd/context");
const {Message, Guild, GuildMember, User} = require("discord.js");

const {defaultLocale: defaultLang} = require("../config.json");
const getLocalePath = lang => `./locale/${lang}.json`;
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

class LocStr {
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
      let fValue = this.fValues[i];
      if (fValue instanceof LocStr) {
        fValue = await fValue.string(lang);
      }
      string = string.replaceAll(`{${i}}`, fValue);
    }

    return string;
  }

  async cstring(src) {
    let lang;
    if (src instanceof Context) {
      lang = src.userData?.config?.language ??
      src.guildData?.config?.language;
    } else if (src instanceof Message || src instanceof Guild) {
      lang = (await DataIO.read("guilds"))?.[src.author.id]
      ?.config?.language;
    } else if (src instanceof Message || src instanceof GuildMember ||
    src instanceof User) {
      lang ??= (await DataIO.read("users"))?.[src.author.id]
      ?.config?.language;
    }
    return await this.string(lang ?? defaultLang);
  }
}

class LocTemp extends LocStr {
  constructor(...parts) {
    super();
    this.parts = parts;
  }

  async string(lang) {
    let result = "";
    for (let part of this.parts) {
      if (part instanceof LocStr) {
        part = await part.string(lang);
      }
      result += part;
    }
    return result;
  }
}

module.exports = exports = {loadLocale, LocStr, LocTemp};
