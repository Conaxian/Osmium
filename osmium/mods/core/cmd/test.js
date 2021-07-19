"use strict";

exports.data = {
  name: "test",
  aliases: [
    "testing",
    "tetht"
  ],

  async *invoke(ctx) {
    ctx.resolve({"content": "Test successful"});
  }
}
