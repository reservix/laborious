import execa from 'execa';
import { fetch } from '../fetch';

jest.mock('execa');

test('fetch', async () => {
  await fetch('cwd');
  expect(((execa as any) as jest.Mock).mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "git",
    Array [
      "fetch",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
]
`);
});
