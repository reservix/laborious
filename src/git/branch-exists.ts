import execa from 'execa';

export const branchExists = async (branch: string) => {
  try {
    await execa('git', ['rev-parse', '--verify', branch]);
    return true;
  } catch {
    return false;
  }
};
