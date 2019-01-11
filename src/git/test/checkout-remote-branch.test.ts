import execa from 'execa';
import { checkoutRemoteBranch } from '../checkout-remote-branch';

jest.mock('execa');

test('checkout a remote branch', async () => {
  await checkoutRemoteBranch('master', 'cwd');
  expect(((execa as any) as jest.Mock).mock.calls).toMatchInlineSnapshot(`
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
      "cwd": "/Users/sebastian/Projects/laborious",
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
