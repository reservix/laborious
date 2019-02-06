import chalk from 'chalk';
import indentString from 'indent-string';
import inquirer, { Questions, Answers } from 'inquirer';
import logSymbols from 'log-symbols';
import { resolve } from 'path';

const logWith = (prefix: string) => (msg: string) =>
  console.log(`${prefix} ${msg}`);

/**
 * Log something!
 *
 * @param msg the message to log
 * @returns nothing
 */
export function log(msg: string) {
  return console.log(msg);
}

log.info = logWith(logSymbols.info);
log.success = logWith(logSymbols.success);
log.warning = logWith(logSymbols.warning);
log.error = logWith(logSymbols.error);
log.indent = (msg: string, indent?: string) =>
  console.log(
    indentString(msg, typeof indent === 'string' ? 1 : 0, {
      indent,
      includeEmptyLines: true,
    })
  );

/**
 * Prompt the user with some questions.
 *
 * @param questions questions to answer
 * @returns the answers
 */
export function prompt<T extends Answers>(questions: Questions<T>): Promise<T> {
  return inquirer.prompt<T>(questions);
}

prompt.separator = (val?: string) => new inquirer.Separator(val);
prompt.headline = (val: string) =>
  new inquirer.Separator(chalk.reset.underline(val));

/**
 * Get commands dir. Useful if you want laborious' commands into your `yargs` app.
 *
 * @returns path to command directory
 */
export const getCommandsDir = () => resolve(__dirname, '..', './commands');
