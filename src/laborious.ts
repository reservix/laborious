import { resolve } from 'path';
import {
  createGitlabService,
  ensureGitlabToken,
  ensureRemoteUrl,
  getLaboriousConfig,
  parseRemoteUrl,
  LABORIOUS_GITLAB_TOKEN_PATH,
  LABORIOUS_NAMESPACE,
} from '.';

export const getGitlabTokenPath = async (cwd: string) => {
  const laborious = await getLaboriousConfig(cwd);

  if (laborious !== null && laborious.token_path) {
    return resolve(laborious._.project, laborious.token_path);
  }

  return LABORIOUS_GITLAB_TOKEN_PATH;
};

export const ensureGitlabConfig = async (cwd: string) => {
  const remote = await ensureRemoteUrl(cwd);
  const url = parseRemoteUrl(remote);

  const path = await getGitlabTokenPath(cwd);
  const token = await ensureGitlabToken(path, url.origin);
  return { url, token };
};

export const ensureGitlabService = async (cwd: string) => {
  const { url, token } = await ensureGitlabConfig(cwd);
  const gitlab = createGitlabService({
    baseUrl: url.origin,
    token,
    userAgent: `${LABORIOUS_NAMESPACE}`,
  });

  return { gitlab, url };
};
