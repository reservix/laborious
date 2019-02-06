import chalk from 'chalk';
import ora from 'ora';
import { Arguments, CommandBuilder } from 'yargs';

import {
  createMessage,
  ensureCurrentBranch,
  ensureGitClean,
  ensureGitlabService,
  ensureLaboriousConfig,
  fetch,
  getBranchStatus,
  log,
} from '..';

export const command = 'merge-request';
export const aliases = ['mr'];
export const describe = 'Create a merge request.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  const { cwd } = argv;

  let spinner = ora('Checking git and fetching updates...').start();

  const { gitlab, url } = await ensureGitlabService(cwd);
  const branch = await ensureCurrentBranch(cwd);
  const { mr } = await ensureLaboriousConfig(cwd);

  const clean = await ensureGitClean(cwd);
  if (!clean) {
    spinner.stop();
    log.warning(
      chalk.bold(`Git is not clean!\n`) +
        `Please make sure you do not have any outstanding changes.\n` +
        `They will not be included in the merge request.`
    );
    return;
  }

  await fetch(cwd);
  const status = await getBranchStatus(`origin/${mr.default_branch}`, cwd);
  if (!status.synced) {
    spinner.stop();
    log.warning(
      chalk.bold(`Your branch is not synced with your remote! `) +
        chalk.dim(`(behind: ${status.behind}, ahead: ${status.ahead})\n`) +
        `Please make sure to merge/rebase & push any updates before creating a merge request.`
    );
    return;
  }

  spinner.succeed('Git is clean and up to date.');
  const answers = await createMessage(mr, 'Merge Request message');

  spinner = ora('Pushing merge request...').start();
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
