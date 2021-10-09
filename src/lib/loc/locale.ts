import { readFile } from "fs/promises";

import Context from "../context";
import Config, { LocaleCode } from "../../../config";

const localePath = (code: string) => `./locale/${code}.json`;
const localeCache = new Map<string, Locale>();

export interface Locale {
  [key: string]: string | Locale;
}

export class Localizable {
  async loc(_locale: LocaleCode): Promise<void | string>;
  async loc(_locale: LocaleCode) {}

  async cloc(src: any) {
    // TODO: finish Localizable.cloc
    // for other types of source
    let locale: LocaleCode | undefined;
    if (src instanceof Context) {
      const userData = await src.userData();
      const guildData = await src.guildData();
      locale = userData?.config?.language ?? guildData?.config?.language;
    }

    return await this.loc(locale ?? Config.defaultLocale);
  }
}

export async function resolveLoc(obj: any, locale: LocaleCode) {
  if (obj instanceof Localizable) {
    obj = await obj.loc(locale);
  }
  return String(obj);
}

export async function resolveCloc(ctx: Context, obj: any) {
  if (obj instanceof Localizable) {
    obj = await obj.cloc(ctx);
  }
  return String(obj);
}

export async function loadLocale(code: LocaleCode, force = false) {
  if (force || !localeCache.has(code)) {
    const path = localePath(code);
    const json = await readFile(path, { encoding: "utf8" });
    const locale: Locale = JSON.parse(json);
    localeCache.set(code, locale);
    return locale;
  }
  return localeCache.get(code)!;
}
