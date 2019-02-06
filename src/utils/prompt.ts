import chalk from 'chalk';
import inquirer, { Questions, Answers } from 'inquirer';

export function prompt<T extends Answers>(questions: Questions<T>): Promise<T> {
  return inquirer.prompt<T>(questions);
}

prompt.separator = (val?: string) => new inquirer.Separator(val);

prompt.headline = (val: string) =>
  new inquirer.Separator(chalk.reset.underline(val));
