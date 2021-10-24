import colors from "colors/safe";

import { hhmmss } from "./timestamp";

import Config from "../../config";

export default class Log {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  private log(level: string, message: string, color="white") {
    const time = hhmmss(new Date());
    const info = `[${time}] [${this.source}/${level}]`;
    // @ts-ignore: npm colors module doesn't have any TS declarations,
    //             string colors aren't recognized by TS
    const text: string = colors[color](`${info}: ${message}`);
    console.log(text);
  }

  info(message: string) {
    this.log("INFO", message, Config.logColors.info);
  }

  warn(message: string) {
    this.log("WARN", message, Config.logColors.warn);
  }

  error(message: string) {
    this.log("ERROR", message, Config.logColors.error);
  }

  debug(message: string) {
    if (!Config.debug) return;
    this.log("DEBUG", message, Config.logColors.debug);
  }
}
