import execa from 'execa';

export const fastForward = async (cwd: string) => {
  await execa('git', ['merge', '--ff-only'], { cwd });
};
