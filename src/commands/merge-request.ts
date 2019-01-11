import chalk from 'chalk';
import ora from 'ora';
import { Arguments, CommandBuilder } from 'yargs';

import {
  ensureCurrentBranch,
  ensureGitlabService,
  ensureLaboriousConfig,
  log,
  prompt,
} from '..';

export const command = 'merge-request';
export const aliases = ['mr'];
export const describe = 'Create a merge request.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  const { gitlab, url } = await ensureGitlabService(argv.cwd);
  const branch = await ensureCurrentBranch(argv.cwd);
  const { mr } = await ensureLaboriousConfig(argv.cwd);

  const answers = await prompt<{
    type: string;
    title: string;
    description: string;
  }>([
    {
      type: 'autocomplete',
      name: 'type',
      message: 'MR Type:',
      choices: Object.entries(mr.types).map(([name, emoji]) => ({
        message: `${emoji}  ${name}`,
        value: emoji,
      })),
    },
    {
      type: 'input',
      name: 'title',
      message: 'MR Title:',
      validate: msg =>
        msg.length > 5
          ? true
          : "The title seems a little short, don't you think!",
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Summarize your changes:',
    },
  ]);

  const spinner = ora('Pushing merge request...').start();
  try {
    const res = await gitlab.project.createMergeRequest({
      id: url.project_with_namespace,
      source_branch: branch,
      target_branch: mr.default_branch,
      title: `${answers.type}  ${answers.title}`,
      description: answers.description,
      squash: mr.squash,
      remove_source_branch: mr.remove_source_branch,
    });

    spinner.succeed(`Merge Request created @ ${res.web_url}`);
  } catch (e) {
    spinner.fail(chalk.redBright('Whoops, something went wrong ...'));
    log.indent(chalk.redBright(e.message));
  }
};
