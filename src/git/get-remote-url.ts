import execa from 'execa';

import { log, prompt } from '../utils';
import { ensureRepository } from './get-respository';
import { isGitUrl } from './utils';

export const getRemoteUrl = async (cwd: string) => {
  const { stdout } = await execa('git', ['ls-remote', '-h', '--get-url'], {
    cwd,
  });
  return stdout.trim();
};

export const ensureRemoteUrl = async (cwd: string) => {
  const gitPath = await ensureRepository(cwd);

  try {
    return await getRemoteUrl(gitPath);
  } catch {
    log.warning('No remote configured.');
    const { remote } = await prompt<{ remote: string }>({
      type: 'input',
      name: 'remote',
      message: 'Remote URL:',
      validate: async val => isGitUrl(val),
    });

    if (!remote) {
      throw new Error(`Aborting. laborious requires a remote to work.`);
    }

    await execa('git', ['remote', 'add', 'origin', remote], { cwd });
    log.success(`Added ${remote} as origin.`);

    return remote;
  }
};
