import opn from 'opn';
import tempy from 'tempy';

import { createGitlabToken } from '../create-token';
import { outputFile } from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __setAnswers } = require('../../utils/prompt');
jest.mock('opn');
jest.mock('fs-extra');
jest.mock('../../utils/log');
jest.mock('../../utils/prompt');

beforeEach(() => {
  __setAnswers({
    token: 'tH!S 1z th3 T0TA||Y S3CR3T T0Kn!',
  });
});

test('create token (unkown git url)', async () => {
  const dir = tempy.directory();
  const token = await createGitlabToken(dir);

  expect(token).toMatchInlineSnapshot(`"tH!S 1z th3 T0TA||Y S3CR3T T0Kn!"`);
});

test('create token (with git url)', async () => {
  const dir = tempy.directory();
  await createGitlabToken(dir, 'https://gitlab.example.com');

  expect(opn).toHaveBeenLastCalledWith(
    expect.stringMatching(new RegExp('https://gitlab.example.com')),
    expect.any(Object)
  );
});

test('create token writes to file', async () => {
  const dir = tempy.directory();
  const token = await createGitlabToken(dir);

  expect(outputFile).toHaveBeenLastCalledWith(dir, token, expect.any(Object));
});
