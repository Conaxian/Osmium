"use strict";

const colors = require("colors");
const { hhmmss } = require("./timestamp");
const { debug, logColors } = require("../../config.json");

module.exports = exports = class Log {
  constructor(source) {
    this.source = source;
  }

  log(level, message, color="white") {
    const time = hhmmss(new Date());
    const info = `[${time}] [${this.source}/${level}]`
    const text = `${info}: ${message}`[color];
    console.log(text);
  }

  info(message) {
    this.log("INFO", message, logColors.info);
  }

  warn(message) {
    this.log("WARN", message, logColors.warn);
  }

  error(message) {
    this.log("ERROR", message, logColors.error);
  }

  debug(message) {
    if (!debug) return;
    this.log("DEBUG", message, logColors.debug);
  }
}
