import { ModuleDefinition } from "../../lib/mod";

import join from "./cmd/join";
import leave from "./cmd/leave";
import play from "./cmd/play";
import skip from "./cmd/skip";
import queue from "./cmd/queue";
import loop from "./cmd/loop";

const mod: ModuleDefinition = {
  name: "music",
  commands: [join, leave, play, skip, queue, loop],
};

export default mod;
