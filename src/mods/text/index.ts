import { ModuleDefinition } from "../../lib/mod";

import say from "./cmd/say";
import lower from "./cmd/lower";
import upper from "./cmd/upper";
import capitalize from "./cmd/capitalize";
import title from "./cmd/title";
import tiny from "./cmd/tiny";
import numeral from "./cmd/numeral";
import roman from "./cmd/roman";

const mod: ModuleDefinition = {
  name: "text",
  commands: [say, lower, upper, capitalize, title, tiny, numeral, roman],
};

export default mod;
