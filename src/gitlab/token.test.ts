import { readFile, outputFile } from 'fs-extra';
import opn from 'opn';
import tempy from 'tempy';

import { createGitlabToken, getGitlabToken } from './token';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __setAnswers } = require('../utils');
jest.mock('opn');
jest.mock('../utils');

beforeEach(() => {
  __setAnswers({
    token: 'tH!S 1z th3 T0TA||Y S3CR3T T0Kn!',
  });
});

test('create token (unkown git url)', async () => {
  const filePath = tempy.file();
  const token = await createGitlabToken(filePath);

  expect(token).toMatchInlineSnapshot(`"tH!S 1z th3 T0TA||Y S3CR3T T0Kn!"`);
});

test('create token (with git url)', async () => {
  const filePath = tempy.file();
  await createGitlabToken(filePath, 'https://gitlab.example.com');

  expect(opn).toHaveBeenLastCalledWith(
    expect.stringMatching(new RegExp('https://gitlab.example.com')),
    expect.any(Object)
  );
});

test('create token writes to file', async () => {
  const filePath = tempy.file();
  const token = await createGitlabToken(filePath);

  const contents = await readFile(filePath, 'utf8');
  expect(token).toEqual(contents);
  expect(contents).toMatchInlineSnapshot(`"tH!S 1z th3 T0TA||Y S3CR3T T0Kn!"`);
});

test('get Gitlab token (exists)', async () => {
  const filePath = tempy.file();
  await outputFile(filePath, 'GI$BZ"(NO"§');
  const token = await getGitlabToken(filePath);
  expect(token).toMatchInlineSnapshot(`"GI$BZ\\"(NO\\"§"`);
});

test('get Gitlab token (ENOENT)', async () => {
  const filePath = tempy.file();
  const token = await getGitlabToken(filePath);
  expect(token).toMatchInlineSnapshot(`null`);
});
