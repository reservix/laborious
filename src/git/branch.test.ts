import originalExeca from 'execa';
import { branchExists, checkoutRemoteBranch, getCurrentBranch } from './branch';

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

  expect(branchExists('master')).resolves.toBeTruthy();
  expect(branchExists('foo')).resolves.toBeFalsy();
});

test('checkout a remote branch', async () => {
  await checkoutRemoteBranch('master', 'cwd');
  expect(((originalExeca as any) as jest.Mock).mock.calls)
    .toMatchInlineSnapshot(`
Array [
  Array [
    "git",
    Array [
      "for-each-ref",
      "--format",
      "%(refname:short)||%(upstream:short)",
      "--points-at",
      "master",
      "refs/heads",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
  Array [
    "git",
    Array [
      "checkout",
      "--track",
      "master",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
]
`);
});

test('get current branch name', async () => {
  execa.mockResolvedValue({ stdout: 'master' });

  const branch = await getCurrentBranch('cwd');
  expect(branch).toMatchInlineSnapshot(`"master"`);
});
