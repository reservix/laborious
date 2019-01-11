import execa from 'execa';
import { getCurrentBranch } from '../get-branch';

jest.mock('execa', () => jest.fn().mockResolvedValue({ stdout: 'master' }));

beforeEach(() => {
  ((execa as any) as jest.Mock).mockClear();
});

test('get current branch name', async () => {
  const branch = await getCurrentBranch('cwd');
  expect(branch).toMatchInlineSnapshot(`"master"`);
});
