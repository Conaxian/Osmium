import Log from "../log";

const log = new Log("lib.utils.typing");

export function notNullish<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    log.error(
      `Assertion failed: \`${val}\` is nullish, expected a non-nullish value`,
    );
  }
}
