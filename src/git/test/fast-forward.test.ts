import execa from 'execa';
import { fastForward } from '../fast-forward';

jest.mock('execa');

test('fast forward', async () => {
  await fastForward('cwd');
  expect(((execa as any) as jest.Mock).mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "git",
    Array [
      "merge",
      "--ff-only",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
]
`);
});
