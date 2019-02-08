import chalk from 'chalk';
import { ChoiceType } from 'inquirer';
import { prompt } from '../utils';

/**
 * Empty list option
 */
export const EMPTY_CHOICE: ChoiceType = {
  name: 'None found.',
  disabled: '',
};

/**
 * Format a list of branches into a list that is consumable by `prompt`.
 *
 * @param branches list of repository branches
 * @returns formated list of branches
 */
export const branchesToChoiceList = <
  T extends { name: string; default: boolean }
>(
  branches: T[]
) => {
  const list = branches.length
    ? branches
        .sort(a => {
          if (a.default) {
            return -1;
          }

          return 1;
        })
        .map<ChoiceType>(b => ({
          name: `🌱  ${b.name}${b.default ? `${chalk.dim(' (default)')}` : ''}`,
          value: { name: b.name, branch: b.name, type: 'Branch' },
        }))
    : [EMPTY_CHOICE];

  return [prompt.headline('\nBranch'), ...list];
};

/**
 * Format a list of merge requests into a list that is consumable by `prompt`.
 *
 * @param mrs list of repository merge requests
 * @returns formated list of merge requests
 */
export const mergeRequestsToChoiceList = <
  T extends { iid: number; title: string; source_branch: string }
>(
  mrs: T[]
) => {
  const list = mrs.length
    ? mrs.map<ChoiceType>(mr => ({
        name: `${mr.title} ${chalk.dim(`(#${mr.iid})`)}`,
        value: {
          name: mr.title,
          branch: mr.source_branch,
          type: 'Merge Request',
        },
      }))
    : [EMPTY_CHOICE];

  return [prompt.headline('\nMerge Request'), ...list];
};
