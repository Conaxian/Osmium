import { ModuleDefinition } from "../../lib/mod";

import help from "./cmd/help";
import about from "./cmd/about";
import ping from "./cmd/ping";
import invite from "./cmd/invite";
import perms from "./cmd/perms";
import avatar from "./cmd/avatar";

const mod: ModuleDefinition = {
  name: "info",
  commands: [help, about, ping, invite, perms, avatar],
};

export default mod;
