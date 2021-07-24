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
          "inline": true
        });
      }

      const name = new LocStr(`mod/${scope.name}/name`);
      embed = await ctx.cembed({
        "title": new LocStr("mod/core/help/help"),
        "text": new LocStr("mod/core/help/command-list").format(name),
        "fields": fields
      });

    } else {
      const fields = [];
      const none = new LocStr("general/none");
      fields.push({
        "name": new LocStr("mod/core/help/syntax"),
        "value": `\`${ctx.prefix}${scope.syntax}\``
      })
      const aliases = scope.aliases.length ?
        "`" + scope.aliases.join("`, `") + "`" : none;
      fields.push({
        "name": new LocStr("mod/core/help/aliases"),
        "value": aliases
      })
      // TODO: Make perms localized
      const perms = scope.perms.length ? scope.perms : none;
      fields.push({
        "name": new LocStr("mod/core/help/perms"),
        "value": perms
      })

      embed = await ctx.cembed({
        "title": new LocStr(`mod/${scope.mod.name}/${scope.name}/name`),
        "text": new LocStr(`mod/${scope.mod.name}/${scope.name}/desc`)
          .format(scope.args.map(arg => arg.fullname)),
        "fields": fields
      });

    }
    ctx.resolve({"embeds": embed});
  }
}
