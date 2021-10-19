import Command, { CommandDefinition } from "../cmd";
import { CmdMap } from "./loader";

export interface ModuleDefinition {
  name: string;
  commands: CommandDefinition[];
  hidden?: boolean;
}

interface ModuleOptions extends ModuleDefinition {
  callNamespace: CmdMap;
}

export default class Module {
  name: string;
  commands: Command[];
  hidden: boolean;

  constructor({ name, commands, hidden, callNamespace }: ModuleOptions) {
    this.name = name;
    this.commands = [];
    this.hidden = hidden ?? false;

    this.loadCommands(commands, callNamespace);
  }

  private loadCommands(commands: CommandDefinition[], callNamespace: CmdMap) {
    for (const cmdDef of commands) {
      const command = new Command({ ...cmdDef, mod: this });
      for (const call of command.calls) {
        callNamespace.set(call, command);
      }
      this.commands.push(command);
    }
  }

  *[Symbol.iterator]() {
    for (const command of this.commands) {
      yield command;
    }
  }
}
