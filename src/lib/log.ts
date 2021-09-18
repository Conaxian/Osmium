import colors from "colors/safe";
import { hhmmss } from "./timestamp";
// @ts-ignore Config should be placed outside the TS root directory
import { debug, logColors } from "../../config.json";

export default class Log {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  log(level: string, message: string, color="white") {
    const time = hhmmss(new Date());
    const info = `[${time}] [${this.source}/${level}]`;
    const text: string = colors[color](`${info}: ${message}`);
    console.log(text);
  }

  info(message: string) {
    this.log("INFO", message, logColors.info);
  }

  warn(message: string) {
    this.log("WARN", message, logColors.warn);
  }

  error(message: string) {
    this.log("ERROR", message, logColors.error);
  }

  debug(message: string) {
    if (!debug) return;
    this.log("DEBUG", message, logColors.debug);
  }
}
