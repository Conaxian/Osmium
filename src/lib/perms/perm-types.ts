export enum AdministrationPerm {
  administrator = "administrator",
  manageGuild = "manage-guild",
  manageRoles = "manage-roles",
  manageChannels = "manage-channels",
  manageThreads = "manage-threads",
  manageEmojisAndStickers = "manage-emojis-and-stickers",
  manageWebhooks = "manage-webhooks",
  viewAuditLog = "view-audit-log",
  viewGuildInsights = "view-guild-insights",
}

export enum ModerationPerm {
  kickMembers = "kick-members",
  banMembers = "ban-members",
  muteMembers = "mute-members",
  deafenMembers = "deafen-members",
  moveMembers = "move-members",
  manageMessages = "manage-messages",
  changeNickname = "change-nickname",
  manageNicknames = "manage-nicknames",
  createInstantInvite = "create-instant-invite",
  mentionEveryone = "mention-everyone",
}

export enum TextChannelPerm {
  viewChannel = "view-channel",
  sendMessages = "send-messages",
  readMessageHistory = "read-message-history",
  usePublicThreads = "use-public-threads",
  usePrivateThreads = "use-private-threads",
  embedLinks = "embed-links",
  attachFiles = "attach-files",
  addReactions = "add-reactions",
  useExternalEmojis = "use-external-emojis",
  useExternalStickers = "use-external-stickers",
  sendTtsMessages = "send-tts-messages",
  useApplicationCommands = "use-application-commands",
}

export enum VoiceChannelPerm {
  connect = "connect",
  speak = "speak",
  stream = "stream",
  useVad = "use-vad",
  requestToSpeak = "request-to-speak",
  prioritySpeaker = "priority-speaker",
}

export type Perm =
  | AdministrationPerm
  | ModerationPerm
  | TextChannelPerm
  | VoiceChannelPerm;

export const permCategories = {
  administration: Object.values(AdministrationPerm),
  moderation: Object.values(ModerationPerm),
  "text-channel": Object.values(TextChannelPerm),
  "voice-channel": Object.values(VoiceChannelPerm),
};

export const allPerms: Perm[] = [
  ...permCategories.administration,
  ...permCategories.moderation,
  ...permCategories["text-channel"],
  ...permCategories["voice-channel"],
];
