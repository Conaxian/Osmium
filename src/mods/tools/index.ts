import { ModuleDefinition } from "../../lib/mod";

import rng from "./cmd/rng";
import shorten from "./cmd/shorten";
import javascript from "./cmd/javascript";
import python from "./cmd/python";

const mod: ModuleDefinition = {
  name: "tools",
  commands: [rng, shorten, javascript, python],
};

export default mod;
