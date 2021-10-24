import { ModuleDefinition } from "../../lib/mod";

import prefix from "./cmd/prefix";

const mod: ModuleDefinition = {
  name: "config",
  commands: [prefix],
};

export default mod;
