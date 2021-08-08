"use strict";

module.exports = exports = {
  commands: [
    require("./cmd/help"),
    require("./cmd/about"),
    require("./cmd/ping"),
    require("./cmd/perms"),
    require("./cmd/avatar")
  ]
};
