import execa from 'execa';
import { ensureRepository, getRefByUpstream } from './repository';

/**
 * Get current repository branch name.
 *
 * @param cwd current working directory
 * @returns branch name
 */
export const getCurrentBranch = async (cwd: string) => {
  const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd,
  });
  return stdout;
};

/**
 * Get current repository branch name.
 * Will prompt user to initialize a repository in `cwd` if `cwd` is not yet
 * inside a repository.
 *
 * @param cwd current working directory
 * @returns branch name
 */
export const ensureCurrentBranch = async (cwd: string) => {
  await ensureRepository(cwd);
  return getCurrentBranch(cwd);
};

/**
 * Check if given `branch` exists
 *
 * @param branch name of the branch
 * @param cwd current working directory
 * @returns if the branch exists
 */
export const branchExists = async (branch: string, cwd: string) => {
  try {
    await execa('git', ['rev-parse', '--verify', branch], { cwd });
    return true;
  } catch {
    return false;
  }
};

/**
 * Checkout a remote branch.
 *
 * @param branch name of the branch
 * @param cwd current working directory
 * @returns resolves when branch is successfully checked out
 */
export const checkoutRemoteBranch = async (branch: string, cwd: string) => {
  const localBranch = await getRefByUpstream(branch, cwd);
  const args = localBranch ? [localBranch] : ['--track', branch];
  await execa('git', ['checkout', ...args], { cwd });
};

const BEHIND_REGEXP = /\d+/g;
const AHEAD_REGEXP = /\s+\d+\s/g;

/**
 * Get number of commits a branch is behind the HEAD.
 *
 * Git command from: https://stackoverflow.com/questions/20433867/git-ahead-behind-info-between-master-and-branch
 *
 * @param branch name of the branch
 * @param cwd current working direcotry
 * @returns number of commits the branch is behind.
 */
const getBehindCount = async (branch: string, cwd: string) => {
  const { stdout } = await execa(
    'git',
    ['rev-list', '--left-right', '--count', `${branch}..`],
    { cwd }
  );

  const [behind] = stdout.match(BEHIND_REGEXP)!.map(Number);
  return behind;
};

/**
 * Get number of commits that have not yet beend pushed to remote.
 *
 * @param cwd current working directory
 * @returns number of unpushed commits
 */
const getUnpushedCommitsCount = async (cwd: string) => {
  const { stdout } = await execa('git', ['shortlog', '-s', '@{u}..'], { cwd });
  const commits = stdout.match(AHEAD_REGEXP);

  return commits === null
    ? 0
    : commits.map(s => Number(s.trim())).reduce((sum, n) => sum + n, 0);
};

/**
 * Check if the `branch` is synced with remote. This means no unpushed commits and
 * no unfetched commits from remote.
 *
 * @param branch name of the branch
 * @param cwd current working directory
 * @returns number the commits the `branch` is behind/ahead and if it is in sync
 */
export const getBranchStatus = async (branch: string, cwd: string) => {
  const behind = await getBehindCount(branch, cwd);
  const ahead = await getUnpushedCommitsCount(cwd);
  const synced = behind === 0 && ahead === 0;
  return { ahead, behind, synced };
};
