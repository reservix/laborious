/* eslint-disable @typescript-eslint/camelcase */
import gitUrl from 'git-url-parse';
import { URL } from 'url';

export const parseGitUrl = (remoteUrl: string) => {
  const normalized = gitUrl(remoteUrl)
    .toString('https')
    .replace(/\.git$/, '');
  const url = new URL(normalized);
  const project_with_namespace = url.pathname.replace(/^\//, '');
  const [namespace, project] = project_with_namespace.split('/');

  return {
    origin: url.origin,
    project_with_namespace,
    namespace,
    project,
  };
};

export const formatProjectId = (val: number | string) =>
  typeof val === 'number' ? val : encodeURIComponent(val);
