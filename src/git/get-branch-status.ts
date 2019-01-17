import execa from 'execa';

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

  return stdout
    .match(AHEAD_REGEXP)!
    .map(s => Number(s.trim()))
    .reduce((sum, n) => sum + n, 0);
};

export const getBranchStatus = async (target: string, cwd: string) => {
  const behind = await getBehindCount(target, cwd);
  const ahead = await getUnpushedCommitsCount(cwd);
  const synced = behind === 0 && ahead === 0;
  return { ahead, behind, synced };
};
