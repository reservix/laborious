import chalk from 'chalk';
import { Arguments, CommandBuilder } from 'yargs';

import {
  ensureGitlabService,
  prompt,
  log,
  fetch,
  checkoutRemoteBranch,
  ensureGitClean,
  fastForward,
} from '..';

const EMPTY_CHOICE = { message: 'None found.', value: null, disabled: '' };
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

  const mrChoices = mrs.length
    ? [
        { role: 'heading', value: chalk.bold('\nMerge Request') },
        ...mrs.map<{ message: string; value: Choice }>(mr => ({
          message: `${mr.title} ${chalk.dim(`(#${mr.iid})`)}`,
          value: {
            name: mr.title,
            branch: mr.source_branch,
            type: 'Merge Request',
          },
        })),
      ]
    : [EMPTY_CHOICE];

  const branchChoices = branches.length
    ? [
        { role: 'heading', value: chalk.bold('\nBranches') },
        ...branches
          .sort(a => {
            if (a.default) {
              return -1;
            }
            return 1;
          })
          .map<{ message: string; value: Choice }>(b => ({
            message: `🌱  ${b.name}${
              b.default ? `${chalk.dim(' (default)')}` : ''
            }`,
            value: { name: b.name, branch: b.name, type: 'Branch' },
          })),
      ]
    : [EMPTY_CHOICE];

  const { selected } = await prompt<{ selected: Choice }>({
    type: 'select',
    name: 'selected',
    message: 'Choose a merge request or branch:',
    choices: [...mrChoices, ...branchChoices],
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
