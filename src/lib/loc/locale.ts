import { readFile } from "fs/promises";
import Context from "../cmd/context";
import Config from "../../../config";

const localePath = (code: string) => `./locale/${code}.json`;
const localeCache = new Map<string, Locale>();

export interface Locale {
  [key: string]: string | Locale;
}

export class Localizable {
  async loc(_locale: string): Promise<void | string>
  async loc(_locale: string) {}

  async cloc(src) {
    let locale;
    if (src instanceof Context) {
      locale = src.userData?.config?.language ??
      src.guildData?.config?.language;
    } // TODO: finish cloc for other types of source
    return await this.loc(locale ?? Config.defaultLocale);
  }
}

export async function resolveLoc(obj: any, locale: string) {
  if (obj instanceof Localizable) {
    obj = await obj.loc(locale);
  }
  return String(obj);
}

export async function loadLocale(code: string, force=false) {
  if (force || !localeCache.has(code)) {
    const path = localePath(code);
    const json = await readFile(path, { encoding: "utf8" });
    const locale: Locale = JSON.parse(json);
    localeCache.set(code, locale);
    return locale;
  }
  return localeCache.get(code)!;
}
