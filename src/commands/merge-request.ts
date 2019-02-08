/* eslint-disable no-await-in-loop */
import chalk from 'chalk';
import { ChoiceType } from 'inquirer';
import ora from 'ora';
import { Arguments, CommandBuilder } from 'yargs';

import {
  branchesToChoiceList,
  createMessage,
  ensureCurrentBranch,
  ensureGitClean,
  ensureGitlabService,
  ensureLaboriousConfig,
  fetch,
  getBranchStatus,
  LaboriousMergeRequestConfig,
  log,
  Message,
  prompt,
} from '..';

// Helper
// ---------------
/**
 * Prompts user with merge request configuration, until she is satisfied.
 *
 * @param config merge request configuration
 * @param getBranchChoices function that returns branch choices
 * @returns merge request message or `null`
 */
const configureMergeRequest = async (
  config: LaboriousMergeRequestConfig,
  getBranchChoices: () => Promise<ChoiceType[]>
) => {
  let message: Message = {
    type: '',
    title: '',
    description: '',
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let targetBranch = config.default_branch;
    message = await createMessage(config.types, message);
    log.indent(
      `${message.type}  ${message.title}\n\n${message.description}\n` +
        chalk.dim('-'.repeat(10)) +
        '\n' +
        `${chalk.bold('Target:')} ${targetBranch}\n`,
      '  '
    );

    const { choice } = await prompt<{
      choice: 'yes' | 'no' | 'abort' | 'target';
    }>({
      type: 'expand',
      name: 'choice',
      message: 'Happy with your merge request?',
      choices: [
        {
          key: 'y',
          name: 'Yes',
          value: 'yes',
        },
        {
          key: 'n',
          name: 'No',
          value: 'no',
        },
        {
          key: 'a',
          name: 'Abort',
          value: 'abort',
        },
        {
          key: 'T',
          name: 'Custom Target',
          value: 'target',
        },
      ],
    });

    if (choice === 'target') {
      const branchChoices = await getBranchChoices();
      const { selected } = await prompt<{
        selected: { name: string; branch: string };
      }>({
        type: 'list',
        name: 'selected',
        message: 'Choose a target branch:',
        choices: branchChoices,
      });
      targetBranch = selected.branch;
    }

    switch (choice) {
      case 'yes':
      case 'target':
        return { message, target: targetBranch };
      case 'abort':
        return null;
      default:
        break;
    }
  }
};

// Command
// ---------------
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
  const { mr: config } = await ensureLaboriousConfig(cwd);

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
  const status = await getBranchStatus(`origin/${config.default_branch}`, cwd);
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

  const mr = await configureMergeRequest(config, async () => {
    const branches = await gitlab.project.listBranches(
      url.project_with_namespace
    );
    return branchesToChoiceList(branches);
  });
  if (!mr) {
    throw new Error(`Aborted.`);
  }

  spinner = ora('Pushing merge request...').start();
  try {
    const res = await gitlab.project.createMergeRequest({
      id: url.project_with_namespace,
      source_branch: branch,
      target_branch: mr.target,
      title: `${mr.message.type}  ${mr.message.title}`,
      description: mr.message.description,
      squash: config.squash,
      remove_source_branch: config.remove_source_branch,
    });

    spinner.succeed(`Merge Request created @ ${res.web_url}`);
  } catch (e) {
    spinner.fail(chalk.redBright('Whoops, something went wrong ...'));
    log.indent(chalk.redBright(e.message));
  }
};
