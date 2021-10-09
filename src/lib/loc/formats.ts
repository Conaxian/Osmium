import { Locale, Localizable, loadLocale, resolveLoc } from "./locale";
import { LocaleCode } from "../../../config";

export class LocStr extends Localizable {
  private id: string;
  private fValues: Array<any>;

  constructor(id: string) {
    super();
    this.id = id;
    this.fValues = [];
  }

  format(...args: any[]) {
    this.fValues = args;
    return this;
  }

  override async loc(locale: LocaleCode) {
    let string: string | Locale = await loadLocale(locale);
    const idPath = this.id.split("/");
    // @ts-ignore: Assert that localization indexing
    //             will always involve correct paths
    idPath.forEach((node) => (string = string[node]));
    string = string as unknown as string;

    for (let i = 0; i < this.fValues.length; i++) {
      const fValue = await resolveLoc(this.fValues[i], locale);
      string = string.replaceAll(`{${i}}`, fValue);
    }

    return string;
  }
}

export class LocGroup extends Localizable {
  private parts: any[];

  constructor(...parts: any[]) {
    super();
    this.parts = parts;
  }

  override async loc(locale: LocaleCode) {
    let result = "";
    for (let part of this.parts) {
      result += await resolveLoc(part, locale);
    }
    return result;
  }
}

export class LocLengthProxy extends Localizable {
  private core: any;
  private length: number;
  private leftPad: any;
  private rightPad: any;

  constructor(
    core: any,
    length: number,
    leftPad: any = "",
    rightPad: any = "",
  ) {
    super();
    this.core = core;
    this.length = length;
    this.leftPad = leftPad;
    this.rightPad = rightPad;
  }

  override async loc(locale: LocaleCode) {
    const parts = {
      left: await resolveLoc(this.leftPad, locale),
      core: await resolveLoc(this.core, locale),
      right: await resolveLoc(this.rightPad, locale),
    };
    const padLength = parts.left.length + parts.right.length;
    const maxLength = this.length - padLength - parts.core.length;
    return parts.left + parts.core.slice(0, maxLength) + parts.right;
  }
}
