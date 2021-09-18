import { Locale, Localizable, loadLocale, resolveLoc } from "./locale";

export class LocStr extends Localizable {
  private id: string;
  private fValues: Array<any>;

  constructor(id: string) {
    super();
    this.id = id;
    this.fValues = [];
  }

  format(...args) {
    this.fValues = args;
    return this;
  }

  async loc(locale: string) {
    let string: string | Locale = await loadLocale(locale);
    const idPath = this.id.split("/");
    idPath.forEach(node => string = string[node]);
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

  constructor(...parts) {
    super();
    this.parts = parts;
  }

  async loc(locale: string) {
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

  constructor(core, length: number, leftPad="", rightPad="") {
    super();
    this.core = core;
    this.length = length;
    this.leftPad = leftPad;
    this.rightPad = rightPad;
  }

  async loc(locale: string) {
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
