import { Localizable } from "./locale";
import { LocStr, LocGroup, LocLengthProxy } from "./formats";

export function $(id: TemplateStringsArray, ...values) {
  let fullId = "";
  for (let i = 0; i < id.length; i++) {
    fullId += id[i];
    if (i < values.length) {
      fullId += values[i];
    }
  }
  return new LocStr(fullId);
}

export function $union(first: string | Localizable,
...parts: Array<string | Localizable>) {
  return new LocGroup(first, ...parts);
}

export function $limited(core, length: number, left="", right="") {
  return new LocLengthProxy(core, length, left, right);
}
