"use strict";

module.exports = exports = class Output {
  constructor(data = {}, reply = true, replyMention = false) {
    this.data = data;
    this.reply = reply;
    if (data.text) data.content = data.text;
    if (!replyMention) {
      this.data.allowedMentions ??= {};
      this.data.allowedMentions.repliedUser = false;
    }
  }
};
