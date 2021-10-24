import { ModuleDefinition } from "../../lib/mod";

import currentUsage from "./cmd/current-usage";
import setActivity from "./cmd/set-activity";

const mod: ModuleDefinition = {
  name: "dev",
  hidden: true,
  commands: [currentUsage, setActivity],
};

export default mod;
