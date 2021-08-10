"use strict";

module.exports = exports = {
  commands: [
    require("./cmd/help"),
    require("./cmd/about"),
    require("./cmd/ping"),
    require("./cmd/invite"),
    require("./cmd/perms"),
    require("./cmd/avatar")
  ]
};
