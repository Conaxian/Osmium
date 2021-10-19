import Command from "../cmd";
import Module, { ModuleDefinition } from "./module";
import Config from "../../../config";

export type ModMap = Map<string, Module>;
export type CmdMap = Map<string, Command>;

export const loadedModules: ModMap = new Map();

export const callNamespace: CmdMap = new Map();

export async function load(name: string) {
  const modPath = `../../mods/${name}`;
  const modDef: ModuleDefinition = (await import(modPath)).default;
  const mod = new Module({ ...modDef, callNamespace });

  loadedModules.set(name, mod);
}

for (const mod of Config.preloadModules) {
  load(mod);
}
