import originalExeca from 'execa';
import {
  branchExists,
  checkoutRemoteBranch,
  getCurrentBranch,
  FORMAT_SEPARATOR,
  getBranchList,
} from './branch';

const execa = (originalExeca as any) as jest.Mock;
jest.mock('execa');

beforeEach(() => {
  execa.mockClear();
});

test('breanch exists', async () => {
  execa.mockImplementation((_: string, args: string[]) => {
    const branch = args[args.length - 1];
    return branch === 'master' ? Promise.resolve() : Promise.reject();
  });

  expect(branchExists('master', 'cwd')).resolves.toBeTruthy();
  expect(branchExists('foo', 'cwd')).resolves.toBeFalsy();
});

test('get list of branches', async () => {
  execa.mockResolvedValue({
    stdout:
      `master${FORMAT_SEPARATOR}origin/master\n` +
      `feature-branch${FORMAT_SEPARATOR}origin/feature-branch`,
  });
  await expect(getBranchList('cwd')).resolves.toMatchInlineSnapshot(`
Array [
  Object {
    "name": "master",
    "tracking": "origin/master",
  },
  Object {
    "name": "feature-branch",
    "tracking": "origin/feature-branch",
  },
]
`);
});

test('checkout a remote branch', async () => {
  execa.mockResolvedValue({
    stdout: `master${FORMAT_SEPARATOR}origin/master`,
  });
  await checkoutRemoteBranch('origin/new-branch', 'cwd');
  expect(execa.mock.calls.pop()).toMatchInlineSnapshot(`
Array [
  "git",
  Array [
    "checkout",
    "--track",
    "origin/new-branch",
  ],
  Object {
    "cwd": "cwd",
  },
]
`);
});

test('switch to a remote branch', async () => {
  execa.mockResolvedValue({
    stdout: `master${FORMAT_SEPARATOR}origin/master`,
  });
  await checkoutRemoteBranch('origin/master', 'cwd');
  expect(execa.mock.calls.pop()).toMatchInlineSnapshot(`
Array [
  "git",
  Array [
    "checkout",
    "master",
  ],
  Object {
    "cwd": "cwd",
  },
]
`);
});

test('get current branch name', async () => {
  execa.mockResolvedValue({ stdout: 'master' });

  const branch = await getCurrentBranch('cwd');
  expect(branch).toMatchInlineSnapshot(`"master"`);
});
