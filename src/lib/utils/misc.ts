import { promisify } from "util";
import { exec } from "child_process";

const ZWSP = "\u200B";

interface EmbedField {
  name: string,
  value: string,
  inline: boolean
}

export function randInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function forceArray(obj: any): any[] {
  if (obj && !Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}

export function safeAccess(
  obj: object,
  path: string,
  defaultIsArray=false,
): any {
  const pathParts = path.split("/");
  for (let property of pathParts) {
    const defaultValue = defaultIsArray ? [] : {};
    if (obj[property] === undefined) obj[property] = defaultValue;
    obj = obj[property];
  }
  return obj;
}

export function attachBlankField(
  fields: EmbedField[],
  index: number,
  inline=true,
) {
  fields.splice(index, 0, {
    name: ZWSP,
    value: ZWSP,
    inline,
  })
}

export function stabilizeFields(fields: EmbedField[]) {
  while (fields.length % 3) {
    attachBlankField(fields, fields.length);
  }
}

export const shell = promisify(exec);
