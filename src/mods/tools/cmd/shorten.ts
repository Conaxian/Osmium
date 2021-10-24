import Axios from "axios";
import { stringify as queryEncode } from "querystring";

import Argument from "../../../lib/arg";
import Config from "../../../../config";
import { CommandDefinition } from "../../../lib/cmd";
import { $ } from "../../../lib/loc";

const command: CommandDefinition = {
  name: "shorten",
  aliases: ["short", "shorturl", "tinyurl"],
  args: [new Argument("<url>", "word")],

  async *invoke(ctx, url: string) {
    const query = "?" + queryEncode({ url: url });

    let urlId: string;
    try {
      const resp = await Axios.get(Config.urlShortener + query);
      urlId = resp.data.id;
    } catch {
      return await ctx.error($`mod/tools/shorten/bad-url`);
    }

    const embed = await ctx.embed({
      title: $`mod/tools/shorten/name`,
      text: Config.shortUrl + urlId,
      type: "ok",
    })
    await ctx.resolve({ embeds: embed });
  },
};

export default command;
