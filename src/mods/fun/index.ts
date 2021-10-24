import { ModuleDefinition } from "../../lib/mod";

import gay from "./cmd/gay";
import penis from "./cmd/penis";

const mod: ModuleDefinition = {
  name: "fun",
  commands: [gay, penis],
};

export default mod;
