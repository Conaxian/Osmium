import {
  BufferResolvable,
  FileOptions,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageMentionOptions,
  StickerResolvable,
  BaseMessageComponentOptions,
  MessageActionRowOptions,
  ReplyMessageOptions,
} from "discord.js";

import { Localizable, resolveCloc } from "../loc";
import { forceArray } from "../utils";
import Context from "./context";

type MessageContent = string | Localizable | undefined;

type MessageFile = FileOptions | BufferResolvable | MessageAttachment;

type MessageComponent =
  | MessageActionRow
  | (Required<BaseMessageComponentOptions> & MessageActionRowOptions);

export interface OutputOptions {
  text?: MessageContent;
  embeds?: MessageEmbed | MessageEmbed[];
  allowedMentions?: MessageMentionOptions;
  files?: MessageFile[];
  components?: MessageComponent[];
  stickers?: StickerResolvable[];
  attachments?: MessageAttachment[];
  reply?: boolean;
  forceReply?: boolean;
  tts?: boolean;
}

export interface Output {
  data: ReplyMessageOptions;
  reply: boolean;
}

export default async function output(
  ctx: Context,
  options: OutputOptions,
): Promise<Output> {
  const content = await resolveCloc(ctx, options.text);
  const allowedMentions = options.allowedMentions ?? { repliedUser: false };

  const data: ReplyMessageOptions = {
    tts: options.tts,
    content,
    embeds: forceArray(options.embeds) as MessageEmbed[],
    allowedMentions,
    files: forceArray(options.files) as MessageFile[],
    components: forceArray(options.components) as MessageComponent[],
    stickers: forceArray(options.stickers) as StickerResolvable[],
    attachments: forceArray(options.attachments) as MessageAttachment[],
    failIfNotExists: options.forceReply,
  };

  return { data, reply: options.reply ?? true };
}
