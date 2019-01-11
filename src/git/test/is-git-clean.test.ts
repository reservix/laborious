import execa from 'execa';
import { isGitClean } from '../is-git-clean';

jest.mock('execa');

test('fetch', async () => {
  ((execa as any) as jest.Mock).mockResolvedValue({ stdout: '' });
  expect(isGitClean('cwd')).resolves.toBeTruthy();

  ((execa as any) as jest.Mock).mockResolvedValue({ stdout: 'nope' });
  expect(isGitClean('cwd')).resolves.toBeFalsy();
});
