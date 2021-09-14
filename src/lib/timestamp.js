"use strict";

function dateTime(date) {
  return date.toISOString()
    .replace(/Z/, "")
    .replace(/-/g, "/")
    .split(/T/);
}

module.exports = exports = {
  YYMMDD(date) {
    return dateTime(date)[0];
  },

  HHMMSS(date) {
    return dateTime(date)[1]
      .replace(/\..+/, "");
  },

  HHMM(date) {
    return dateTime(date)[1]
      .replace(/:\d{2}\..+/, "");
  }
};
