import execa from 'execa';
import { ensureRepository } from './get-respository';

export const getCurrentBranch = async (cwd: string) => {
  const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd,
  });
  return stdout;
};

export const ensureCurrentBranch = async (cwd: string) => {
  await ensureRepository(cwd);
  return getCurrentBranch(cwd);
};
