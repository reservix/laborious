import findUp from 'find-up';
import { dirname } from 'path';

import { log, prompt } from '../utils';
import { init } from './init';

export const getRepository = async (cwd: string) => findUp('.git', { cwd });

export const ensureRepository = async (cwd: string) => {
  const gitPath = await getRepository(cwd);

  if (gitPath) {
    return dirname(gitPath);
  }

  log.warning('No git repository found.');
  const { initGit } = await prompt<{ initGit: boolean }>({
    type: 'confirm',
    name: 'init',
    message: `Do you want to initialize a git repository in "${cwd}"?`,
    initial: true,
  });

  if (!initGit) {
    throw new Error(`Aborting. laborious requires a git repository to work.`);
  }

  return init(cwd);
};
