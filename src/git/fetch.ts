import execa from 'execa';

export const fetch = async (cwd: string) => {
  await execa('git', ['fetch'], { cwd });
};
