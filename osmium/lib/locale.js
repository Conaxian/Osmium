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
      string = string.replaceAll(`{${i}}`, this.fValues[i]);
    }
    return string;
  }

  async cstring(src) {
    let lang;
    if (src instanceof Context) {
      lang = src.userConfig?.language ?? src.guildConfig?.language;
    } else if (src instanceof Message || src instanceof Guild) {
      lang = await DataIO.read("guilds")?.[src.author.id]
      ?.config?.language;
    } else if (src instanceof Message || src instanceof GuildMember ||
    src instanceof User) {
      lang ??= await DataIO.read("users")?.[src.author.id]
      ?.config?.language;
    }
    return await this.string(lang ?? defaultLang);
  }
}

module.exports = exports = {loadLocale, LocStr};
