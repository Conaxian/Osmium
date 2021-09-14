"use strict";

const fs = require("fs/promises");
const getPath = file => `data/${file}.json`;

const cache = new Map();

module.exports = exports = {
  async read(file) {
    if (cache.has(file)) return cache.get(file);
    const path = getPath(file);
    let object;

    try {
      const json = await fs.readFile(path, {encoding: "utf8"});
      object = JSON.parse(json);
    } catch (err) {
      object = {};
    }

    cache.set(file, object);
    return object;
  },

  async write(file, object) {
    cache.set(file, object);
    const path = getPath(file);
    const json = JSON.stringify(object, null, 2);
    await fs.writeFile(path, json, {encoding: "utf8"});
  }
};
