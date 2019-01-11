import execa from 'execa';
import { getRefByUpstream } from './get-ref-by-upstream';

export const checkoutRemoteBranch = async (branch: string, cwd: string) => {
  const localBranch = await getRefByUpstream(branch);
  const args = localBranch ? [localBranch] : ['--track', branch];
  await execa('git', ['checkout', ...args], { cwd });
};
