function dateTime(date: Date) {
  return date.toISOString()
    .replace(/Z/, "")
    .replace(/-/g, "/")
    .split(/T/);
}

export function yymmdd(date: Date) {
  return dateTime(date)[0];
}

export function hhmmss(date: Date) {
  return dateTime(date)[1]
    .replace(/\..+/, "");
}

export function hhmm(date: Date) {
  return dateTime(date)[1]
    .replace(/:\d{2}\..+/, "");
}

export function fullDate(date: Date) {
  const dateString = dateTime(date)[0];
  const timeString = dateTime(date)[1]
    .replace(/\..+/, "");
  return dateString + "-" + timeString;
}
