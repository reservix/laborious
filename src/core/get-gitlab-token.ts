import { readFile } from 'fs-extra';

import { prompt } from '../utils';
import { createGitlabToken } from '../gitlab';

export const getGitlabToken = async (filePath: string) => {
  if (process.env.GITLAB_TOKEN) {
    return process.env.GITLAB_TOKEN;
  }

  const token = await readFile(filePath, 'utf8');
  return token;
};

export const ensureGitlabToken = async (
  filePath: string,
  gitlabUrl?: string
) => {
  const token = await getGitlabToken(filePath);

  if (token) {
    return token;
  }

  const { init } = await prompt<{ init: boolean }>({
    type: 'confirm',
    name: 'init',
    message: `A Gitlab token is required. Create one?`,
    initial: true,
  });

  if (!init) {
    throw new Error(
      `A Gitlab token is required to perform your task. Aborting.`
    );
  }

  return createGitlabToken(filePath, gitlabUrl);
};
