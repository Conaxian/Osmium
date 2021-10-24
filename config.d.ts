import { ActivityType, LocaleCode } from "./src/types";

import config from "./config";

interface BotActivity {
  name: string;
  type: ActivityType;
}

type ModName = "info" | "text" | "tools" | "fun" | "music" | "config" | "dev";

type TerminalColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey";

interface CembedTypesConfig<T> {
  default: T;
  ok: T;
  error: T;
  info: T;
  warn: T;
  music: T;
  loading: T;
}

interface Emojis {
  ok: string;
  error: string;
  info: string;
  warn: string;
  music: string;
  loading: string;
}

interface LogColors {
  info: TerminalColor;
  warn: TerminalColor;
  error: TerminalColor;
  debug: TerminalColor;
}

interface Config {
  debug: boolean;
  prefix: string;
  cmdCooldown: number;

  author: string;
  botInvite: string;
  gitHub: string;

  pythonCmd: string;

  activity: BotActivity;

  devs: string[];

  defaultLocale: LocaleCode;
  locales: LocaleCode[];

  preloadModules: ModName[];

  cembedColors: CembedTypesConfig<string>;
  cembedIcons: CembedTypesConfig<string>;

  emojis: Emojis;

  logColors: LogColors;

  urlShortener: string;
  shortUrl: string;

  youtubeCookie: string;
}

const exportConfig: Config = config;
export default exportConfig;
