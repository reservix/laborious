import { outputJson } from 'fs-extra';

import { ensureRepository } from '../git';
import { log, prompt } from '../utils';

import { LABORIOUS_DEFAULT_CONFIG_NAME } from './constants';
import { defaultConfig } from './default-config';
import { LaboriousMergeRequestConfig, LaboriousInternalConfig } from './types';
import { validateLaboriousConfig } from './validate-config';

export const createConfig = async (cwd: string) => {
  const projectPath = await ensureRepository(cwd);

  log.info('Please answer the following questions about Merge Requests!');

  const mr = await prompt<
    Pick<
      LaboriousMergeRequestConfig,
      'default_branch' | 'squash' | 'remove_source_branch'
    >
  >([
    {
      type: 'input',
      name: 'default_branch',
      message: 'Name of the default target branch for MRs:',
      initial: defaultConfig.mr.default_branch,
    },
    {
      type: 'confirm',
      name: 'squash',
      message: 'Should MRs be squashed?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'remove_source_branch',
      message: 'Remove source branch after merge?',
      initial: true,
    },
  ]);

  const contents = { mr };
  const configFilePath = `${projectPath}/${LABORIOUS_DEFAULT_CONFIG_NAME}`;
  await outputJson(configFilePath, contents, {
    spaces: 2,
  });

  const config = await validateLaboriousConfig(contents);

  return {
    ...config,
    _: { file: configFilePath, project: projectPath },
  } as LaboriousInternalConfig;
};
