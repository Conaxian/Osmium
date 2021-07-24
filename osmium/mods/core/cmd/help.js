"use strict";

const Arg = require("../../../lib/cmd/argument");
const Mod = require("../../../lib/mod");
const {LocStr} = require("../../../lib/locale");
const {loadedModules} = require("../../../lib/loader");

exports.data = {
  name: "help",
  args: [
    new Arg("[command/module]", "command_module")
  ],

  async *invoke(ctx, scope) {
    let embed;
    if (!scope) {
      const fields = [];
      for (module of loadedModules.values()) {
        let desc = new LocStr(`mod/${module.name}/desc`);
        let text = new LocStr("mod/core/help/module-help")
          .format(desc, ctx.prefix, module.name);
        fields.push({
          "name": new LocStr(`mod/${module.name}/name`),
          "value": text
        });
      }

      embed = await ctx.cembed({
        "title": new LocStr("mod/core/help/help"),
        "text": new LocStr("mod/core/help/module-list"),
        "fields": fields
      });

    } else if (scope instanceof Mod) {
      const fields = [];
      for (let command of scope.commands) {
        fields.push({
          "name": new LocStr(`mod/${scope.name}/${command.name}/name`),
          "value": `\`${ctx.prefix}help ${command.name}\``,
          "fields": fields
        });
      }

      const name = new LocStr(`mod/${scope.name}/name`);
      embed = await ctx.cembed({
        "title": new LocStr("mod/core/help/help"),
        "text": new LocStr("mod/core/help/command-list").format(name),
        "fields": fields
      });

    } else {
      embed = await ctx.cembed({
        "title": new LocStr("mod/core/help/help"),
        "text": "Work In Progress (detailed command info isn't available yet)"
      });

    }
    ctx.resolve({"embeds": embed});
  }
}
