"use strict";

const Arg = require("../../../lib/cmd/argument");
const Mod = require("../../../lib/mod");
const {Range, stabilizeFieldLayout} = require("../../../lib/util");
const {LocStr, LocGroup} = require("../../../lib/locale");
const {loadedModules} = require("../../../lib/loader");

module.exports = exports = {
  name: "help",
  args: [
    new Arg("[command/module]", "command-module")
  ],

  async *invoke(ctx, scope) {
    let embed;
    if (!scope) {
      const fields = [];
      for (let mod of loadedModules.values()) {
        if (mod.hidden) continue;
        let desc = new LocStr(`mod/${mod.name}/desc`);
        let text = new LocStr("mod/info/help/module-help")
          .format(desc, ctx.prefix, mod.name);
        fields.push({
          name: new LocStr(`mod/${mod.name}/name`),
          value: text,
          inline: true
        });
      }
      stabilizeFieldLayout(fields);

      embed = await ctx.cembed({
        title: new LocStr("mod/info/help/name"),
        text: new LocStr("mod/info/help/module-list"),
        fields,
        type: "info"
      });

    } else if (scope instanceof Mod) {
      const fields = [];
      for (let command of scope.commands) {
        fields.push({
          name: new LocStr(`mod/${scope.name}/${command.name}/name`),
          value: `\`${ctx.prefix}help ${command.name}\``,
          inline: true
        });
      }
      stabilizeFieldLayout(fields);

      const name = new LocStr(`mod/${scope.name}/name`);
      embed = await ctx.cembed({
        title: new LocStr("mod/info/help/name"),
        text: new LocStr("mod/info/help/command-list").format(name),
        fields,
        type: "info"
      });

    } else {
      const fields = [];
      const none = new LocStr("general/none");
      fields.push({
        name: new LocStr("mod/info/help/syntax"),
        value: `\`${ctx.prefix}${scope.syntax}\``
      });
      const aliases = scope.aliases.length ?
        "`" + scope.aliases.join("`, `") + "`" : none;
      fields.push({
        name: new LocStr("mod/info/help/aliases"),
        value: aliases
      });

      const perms = [];
      if (scope.perms.length) {
        for (let i of new Range(scope.perms.length)) {
          const perm = scope.perms[i];
          if (i) perms.push(", ");
          perms.push(new LocStr(`perms/${perm}`));
        }
      }
      fields.push({
        name: new LocStr("mod/info/help/perms"),
        value: perms.length ? new LocGroup(...perms) : none
      });

      embed = await ctx.cembed({
        title: new LocStr(`mod/${scope.mod.name}/${scope.name}/name`),
        text: new LocStr(`mod/${scope.mod.name}/${scope.name}/desc`)
          .format(...scope.args.map(arg => arg.fullname)),
        fields,
        type: "info"
      });

    }
    ctx.resolve({embeds: embed});
  }
}