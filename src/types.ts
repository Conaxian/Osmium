export enum ActivityTypes {
  PLAYING,
  STREAMING,
  LISTENING,
  WATCHING,
  COMPETING,
}

export type ActivityType = keyof typeof ActivityTypes;

export type LocaleCode = "en-US";

export type EmbedType = "ok" | "error" | "info" | "warn" | "music" | "loading";
