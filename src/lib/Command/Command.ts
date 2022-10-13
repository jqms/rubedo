import { COMMANDS } from "./index.js";
import { Argument } from "./Argument";
import type {
  AddArgumentReturn,
  ArgumentTypeValue,
  ICommandData,
  ISubCommandData,
} from "./types";

export class Command<Callback extends Function = (ctx: Object) => void> {
  /**
   * The Details about this command
   */
  data: ICommandData;

  /**
   * The Arguments on this command
   */
  args: Argument[];

  /**
   * Function to run when this command is called
   */
  callback: Callback;

  constructor(data: ICommandData) {
    this.data = data;
    this.args = [];

    this.callback = null;
    COMMANDS.push(this);
  }

  /**
   * Creates a new Command with this argument added to it
   * @param name Name of this argument
   * @param type the type of this argument
   * @returns a new command with this argument added
   */
  addArgument<T extends ArgumentTypeValue | ISubCommandData>(
    name: string,
    type: T | ISubCommandData = {}
  ): Command<AddArgumentReturn<T, Callback>> {
    this.args.push(new Argument(name, type));
    // @ts-ignore
    return this;
  }

  /**
   * Registers this command and its apendending arguments
   * @param callback what to run when this command gets called
   */
  executes(callback: Callback): void {
    this.callback = callback;
  }
}
