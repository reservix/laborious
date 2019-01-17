import execa from 'execa';

// Git command from: https://stackoverflow.com/questions/20433867/git-ahead-behind-info-between-master-and-branch
const BEHIND_AHEAD_REGEXP = /(\d+)\s*(\d+)/;

export const getBranchStatus = async (
  from: string,
  target: string,
  cwd: string
) => {
  const { stdout } = await execa(
    'git',
    ['rev-list', '--left-right', '--count', `${target}...${from}`],
    { cwd }
  );

  const [, b, a] = BEHIND_AHEAD_REGEXP.exec(stdout)!;

  const ahead = Number(a);
  const behind = Number(b);
  const synced = behind === 0 && ahead === 0;

  return { ahead, behind, synced };
};
