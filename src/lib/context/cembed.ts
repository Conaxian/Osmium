import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from "discord.js";

import Config from "../../../config";
import { Localizable, resolveCloc } from "../loc";
import { forceArray } from "../utils";
import { EmbedType } from "../../types";

import Context from "./context";

const DEFAULT_INLINENESS = true;

type CembedString = string | Localizable | undefined;

export interface CembedField {
  name: string | Localizable;
  value: string | Localizable;
  inline?: boolean;
}

interface CembedAuthor {
  name?: CembedString;
  url?: string;
  iconUrl?: string;
  proxyIconUrl?: string;
}

interface CembedResource {
  url?: string;
  proxyUrl?: string;
  width?: number;
  height?: number;
}

interface CembedFooter {
  text?: CembedString;
  iconUrl?: string;
  proxyIconUrl?: string;
}

export interface CembedOptions {
  type?: EmbedType;
  text?: CembedString;
  title?: CembedString;
  url?: string;
  timestamp?: number | Date;
  color?: ColorResolvable;
  fields?: CembedField | CembedField[];
  author?: CembedAuthor;
  thumbnail?: CembedResource;
  image?: CembedResource;
  video?: CembedResource;
  footer?: CembedFooter;
}

function attachResource(
  embedOptions: MessageEmbedOptions,
  type: "thumbnail" | "image" | "video",
  options: CembedOptions,
) {
  if (options[type]) {
    embedOptions[type] = {
      url: options[type]!.url,
      proxyURL: options[type]!.proxyUrl,
      height: options[type]!.height,
      width: options[type]!.width,
    };
  }
}

export default async function cembed(ctx: Context, options: CembedOptions) {
  const resolved = (data: CembedString) => resolveCloc(ctx, data);

  const embedOptions: MessageEmbedOptions = {};

  embedOptions.title = await resolved(options.title);
  embedOptions.description = await resolved(options.text);
  embedOptions.url = options.url;
  embedOptions.timestamp = options.timestamp;
  embedOptions.color = options.color;

  embedOptions.fields = [];
  options.fields = (forceArray(options.fields) ?? []) as CembedField[];
  for (const field of options.fields) {
    embedOptions.fields.push({
      name: (await resolved(field.name))!,
      value: (await resolved(field.value))!,
      inline: field.inline !== undefined ? field.inline : DEFAULT_INLINENESS,
    });
  }

  if (options.author) {
    embedOptions.author = {
      name: await resolved(options.author.name),
      url: options.author.url,
      iconURL: options.author.iconUrl,
      proxyIconURL: options.author.proxyIconUrl,
    };
  }

  attachResource(embedOptions, "thumbnail", options);
  attachResource(embedOptions, "image", options);
  attachResource(embedOptions, "video", options);

  if (options.footer) {
    embedOptions.footer = {
      text: await resolved(options.footer.text),
      iconURL: options.footer.iconUrl,
      proxyIconURL: options.footer.proxyIconUrl,
    };
  } else {
    embedOptions.footer = { text: "Osmium" };
  }

  embedOptions.timestamp ??= new Date();
  if (options.type) {
    embedOptions.color ??= Config.cembedColors[options.type] as ColorResolvable;
    embedOptions.footer.iconURL ??= Config.cembedIcons[options.type];
  }

  embedOptions.color ??= (Config.cembedColors.default as ColorResolvable);
  embedOptions.footer.iconURL ??= Config.cembedIcons.default;

  return new MessageEmbed(embedOptions);
}
