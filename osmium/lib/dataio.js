"use strict";

const fs = require("fs/promises");
const getPath = file => `../data/${file}.json`;

module.exports = exports = {
  async read(file) {
    const path = getPath(file);
    let json;
    try {
      json = await fs.readFile(path, {encoding: "utf8"});
    } catch (err) {
      return {};
    }
    return JSON.parse(json);
  },

  async write(file, object) {
    const path = getPath(file);
    const json = JSON.stringify(object, null, 2);
    await fs.writeFile(path, json, {encoding: "utf8"});
  }
};
