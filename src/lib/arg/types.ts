import Context from "../context";

interface FormatterOptions {
  ctx: Context;
  string: string;
}

type FormatResultCode = "SUCCESS" | "MISSING" | "INVALID";

export interface FormatterOutput {
  code: FormatResultCode;
  value: any;
  remainder: string;
}

type Formatter = (options: FormatterOptions) => Promise<FormatterOutput>;

export interface Formatters {
  word: Formatter;
  infString: Formatter;
  pyCode: Formatter;
  jsCode: Formatter;
  int: Formatter;
  num: Formatter;
  commandModule: Formatter;
  member: Formatter;
  activityType: Formatter;
}

export type FormatName = keyof Formatters;

export function resultSuccess(value: any, remainder: string): FormatterOutput {
  return { code: "SUCCESS", value, remainder };
}

export function resultMissing(): FormatterOutput {
  return { code: "MISSING", value: null, remainder: "" };
}

export function resultInvalid(value: any): FormatterOutput {
  return { code: "INVALID", value, remainder: "" };
}
