import { ensureRemoteUrl } from '../git';
import { createGitlabService, parseGitUrl } from '../gitlab';

import { LABORIOUS_GITLAB_TOKEN_PATH, LABORIOUS_NAMESPACE } from './constants';
import { ensureGitlabToken } from './get-gitlab-token';

export const ensureGitlabConfig = async (cwd: string) => {
  const remote = await ensureRemoteUrl(cwd);
  const url = parseGitUrl(remote);
  const token = await ensureGitlabToken(
    LABORIOUS_GITLAB_TOKEN_PATH,
    url.origin
  );
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
