import { outputFile, readFile } from 'fs-extra';
import opn from 'opn';
import { URL } from 'url';

import { log, prompt } from '..';

export const createGitlabToken = async (
  filePath: string,
  gitlabUrl?: string
) => {
  if (gitlabUrl) {
    const url = new URL(gitlabUrl);
    url.pathname = 'profile/personal_access_tokens';

    const { openUrl } = await prompt<{ openUrl: boolean }>({
      type: 'confirm',
      name: 'openUrl',
      message: `Open Gitlab's profile page?`,
      default: true,
    });

    if (openUrl) {
      opn(url.href, { wait: false });
      log.info(
        `Please create an access token that has access to the API scope ` +
          `and paste it below.`
      );
    }
  } else {
    log.info(
      `You can find information about how to create an access token` +
        `in the official Gitlab documentation:\n` +
        `https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html`
    );
  }

  const { token } = await prompt<{ token: string }>({
    type: 'password',
    name: 'token',
    message: 'Gitlab token:',
  });

  await outputFile(filePath, token, { encoding: 'utf-8' });
  log.success(`Gitlab token stored @ ${filePath}`);

  return token;
};

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
    default: true,
  });

  if (!init) {
    throw new Error(
      `A Gitlab token is required to perform your task. Aborting.`
    );
  }

  return createGitlabToken(filePath, gitlabUrl);
};
