import chalk from 'chalk';
import { Arguments, CommandBuilder } from 'yargs';

import {
  branchesToChoiceList,
  checkoutRemoteBranch,
  ensureGitClean,
  ensureGitlabService,
  fastForward,
  fetch,
  log,
  mergeRequestsToChoiceList,
  prompt,
} from '..';

type Choice = {
  name: string;
  branch: string;
  type: 'Branch' | 'Merge Request';
};

export const command = 'checkout';
export const aliases = ['co'];
export const describe = 'Checkout merge requests and branches.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  const { cwd } = argv;

  const clean = await ensureGitClean(cwd);
  if (!clean) {
    log.warning(
      chalk.bold('Git is not clean!\n') +
        'Please make sure you do not have any outstanding changes.\n' +
        'They might get lost otherwise.'
    );
    return;
  }

  const { gitlab, url } = await ensureGitlabService(cwd);
  const [mrs, branches] = await Promise.all([
    gitlab.project.listMergeRequests(url.project_with_namespace),
    gitlab.project.listBranches(url.project_with_namespace),
  ]);

  if (mrs.length + branches.length === 0) {
    throw new Error('No branches and/or mrs found.');
  }

  const { selected } = await prompt<{ selected: Choice }>({
    type: 'list',
    name: 'selected',
    message: 'Choose a merge request or branch:',
    choices: [
      ...mergeRequestsToChoiceList(mrs),
      ...branchesToChoiceList(branches),
    ],
  });

  await fetch(cwd);
  await checkoutRemoteBranch(`origin/${selected.branch}`, cwd);

  try {
    await fastForward(cwd);
    const msg =
      selected.type === 'Branch'
        ? `Switched to branch ${chalk.bold(selected.branch)}!`
        : `Checked out ${chalk.bold(selected.name)}! ` +
          chalk.dim(`(branch: ${selected.branch})`);
    log.success(msg);
  } catch (e) {
    log.error(
      `Switched to branch ${chalk.bold(selected.branch)},` +
        `but couldn't fast farward to the latest revision.`
    );
    throw new Error(e.message);
  }
};
