import execa from 'execa';
import { ensureRepository } from './get-respository';

export const isGitClean = async (cwd: string) => {
  const { stdout } = await execa(
    'git',
    ['status', '--untracked-files=no', '--porcelain'],
    { cwd }
  );
  return stdout === '';
};

export const ensureGitClean = async (cwd: string) => {
  await ensureRepository(cwd);
  return isGitClean(cwd);
};
