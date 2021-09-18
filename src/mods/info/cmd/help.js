"use strict";

const Arg = require("../../../lib/cmd/argument");
const Mod = require("../../../lib/mod");
const { stabilizeFields } = require("../../../lib/utils");
const { $, $union } = require("../../../lib/loc");
const { loadedModules } = require("../../../lib/loader");

module.exports = exports = {
  name: "help",
  aliases: [
    "h",
  ],
  args: [
    new Arg("[command/module]", "command-module"),
  ],

  async *invoke(ctx, scope) {
    let embed;
    if (!scope) {
      const fields = [];
      for (let mod of loadedModules.values()) {
        if (mod.hidden) continue;
        let desc = $`mod/${mod.name}/desc`;
        let text = $`mod/info/help/module-help`
          .format(desc, ctx.prefix, mod.name);
        fields.push({
          name: $`mod/${mod.name}/name`,
          value: text,
          inline: true
        });
      }
      stabilizeFields(fields);

      embed = await ctx.cembed({
        title: $`mod/info/help/name`,
        text: $`mod/info/help/module-list`,
        fields,
        type: "info"
      });

    } else if (scope instanceof Mod) {
      const fields = [];
      for (let command of scope.commands) {
        fields.push({
          name: $`mod/${scope.name}/${command.name}/name`,
          value: `\`${ctx.prefix}help ${command.name}\``,
          inline: true
        });
      }
      stabilizeFields(fields);

      const name = $`mod/${scope.name}/name`;
      embed = await ctx.cembed({
        title: $`mod/info/help/name`,
        text: $`mod/info/help/command-list`.format(name),
        fields,
        type: "info"
      });

    } else {
      const fields = [];
      const none = $`general/none`;
      fields.push({
        name: $`mod/info/help/syntax`,
        value: `\`${ctx.prefix}${scope.syntax}\``
      });
      const aliases = scope.aliases.length ?
        "`" + scope.aliases.join("`, `") + "`" : none;
      fields.push({
        name: $`mod/info/help/aliases`,
        value: aliases
      });

      const perms = [];
      if (scope.perms.length) {
        for (let i = 0; i < scope.perms.length; i++) {
          const perm = scope.perms[i];
          if (i) perms.push(", ");
          perms.push($`perms/${perm}`);
        }
      }
      fields.push({
        name: $`mod/info/help/perms`,
        value: perms.length ? $union(...perms) : none
      });

      embed = await ctx.cembed({
        title: $`mod/${scope.mod.name}/${scope.name}/name`,
        text: $`mod/${scope.mod.name}/${scope.name}/desc`
          .format(...scope.args.map(arg => arg.fullname)),
        fields,
        type: "info"
      });

    }
    ctx.resolve({embeds: embed});
  },
}
