import execa from 'execa';
import { ensureRepository, getRefByUpstream } from './repository';

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

export const branchExists = async (branch: string) => {
  try {
    await execa('git', ['rev-parse', '--verify', branch]);
    return true;
  } catch {
    return false;
  }
};

export const checkoutRemoteBranch = async (branch: string, cwd: string) => {
  const localBranch = await getRefByUpstream(branch, cwd);
  const args = localBranch ? [localBranch] : ['--track', branch];
  await execa('git', ['checkout', ...args], { cwd });
};

const BEHIND_REGEXP = /\d+/g;
const AHEAD_REGEXP = /\s+\d+\s/g;

// Git command from: https://stackoverflow.com/questions/20433867/git-ahead-behind-info-between-master-and-branch
const getBehindCount = async (branch: string, cwd: string) => {
  const { stdout } = await execa(
    'git',
    ['rev-list', '--left-right', '--count', `${branch}..`],
    { cwd }
  );

  const [behind] = stdout.match(BEHIND_REGEXP)!.map(Number);
  return behind;
};

const getUnpushedCommitsCount = async (cwd: string) => {
  const { stdout } = await execa('git', ['shortlog', '-s', '@{u}..'], { cwd });
  const commits = stdout.match(AHEAD_REGEXP);

  return commits === null
    ? 0
    : commits.map(s => Number(s.trim())).reduce((sum, n) => sum + n, 0);
};

export const getBranchStatus = async (target: string, cwd: string) => {
  const behind = await getBehindCount(target, cwd);
  const ahead = await getUnpushedCommitsCount(cwd);
  const synced = behind === 0 && ahead === 0;
  return { ahead, behind, synced };
};
