/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Command} from './Command';
import type {ConsoleIO} from './ConsoleIO';
import type {DispatcherInterface} from './DispatcherInterface';

export default class HelpCommand implements Command {
  name = 'help';
  helpText = 'Give help about the debugger command set.';
  _console: ConsoleIO;
  _dispatcher: DispatcherInterface;

  constructor(con: ConsoleIO, dispatcher: DispatcherInterface) {
    this._console = con;
    this._dispatcher = dispatcher;
  }

  async execute(args: string[]): Promise<void> {
    const [command] = args;

    if (command != null) {
      this._displayDetailedHelp(command);
      return;
    }

    this._displayHelp();
  }

  _displayHelp(): void {
    const commands = this._dispatcher.getCommands();
    const commandDict = {};
    commands.forEach(x => (commandDict[x.name] = x));

    const commandNames = commands.map(x => x.name).sort();

    commandNames.forEach(name => {
      this._console.outputLine(`${name}: ${commandDict[name].helpText}`);
    });
  }

  _displayDetailedHelp(cmd: string): void {
    const commands = this._dispatcher.getCommandsMatching(cmd);
    if (commands.length === 0) {
      throw new Error(`There is no command "${cmd}"`);
    }

    if (commands.length > 1) {
      const list = this._dispatcher.commandListToString(commands);
      throw new Error(`Multiple commands match "${cmd}": ${list}`);
    }

    const command = commands[0];

    if (command.detailedHelpText != null) {
      this._console.outputLine(command.detailedHelpText);
      return;
    }

    this._console.outputLine(command.helpText);
  }
}
