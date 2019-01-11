import execa from 'execa';

export const init = async (cwd: string) => {
  await execa('git', ['init']);
  return cwd;
};
