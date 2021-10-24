import { Localizable } from "./locale";
import { LocStr, LocGroup, LocLengthProxy } from "./formats";

export function $(id: TemplateStringsArray, ...values: any[]) {
  let fullId = "";
  for (let i = 0; i < id.length; i++) {
    fullId += id[i];
    if (i < values.length) {
      fullId += values[i];
    }
  }
  return new LocStr(fullId);
}

export function $union(
  ...parts: Array<string | Localizable>
) {
  return new LocGroup(...parts);
}

export function $limited(
  core: string | Localizable,
  length: number,
  left: string | Localizable = "",
  right: string | Localizable = "",
) {
  return new LocLengthProxy(core, length, left, right);
}
