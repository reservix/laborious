import got, { GotJSONOptions, GotError } from 'got';
import { URL } from 'url';

import * as pathname from './pathname';
import { GitlabResponse, GitlabProjectID } from './types';

export type GitlabApiConfig = {
  baseUrl: string;
  token: string;
  userAgent: string;
};

/**
 * `got.create` is currently not part of the typings and adding them failed
 * (https://github.com/DefinitelyTyped/DefinitelyTyped/pull/31385). So we just
 * code "around" this by just using `got`.
 *
 * @returns GitlabService
 */
export const create = ({ baseUrl, token, userAgent }: GitlabApiConfig) => {
  const apiURL = new URL(baseUrl);
  apiURL.pathname = pathname.API_PREFIX;

  const config: GotJSONOptions = {
    json: true,
    headers: {
      'private-token': token,
      accept: 'application/json',
      'user-agent': userAgent,
    },
  };

  return async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete',
    url: string,
    options: Pick<GotJSONOptions, 'body' | 'query'> = {}
  ) => {
    try {
      const res = await got[method](`${apiURL}${url}`, {
        ...config,
        ...options,
      });
      return res.body as T;
    } catch (e) {
      const body = (e as GotError).response.body;
      const message: string[] = Array.isArray(body.message)
        ? body.message
        : [body.message];

      const err = new Error(message.map(s => `  ${s}`).join('\n'));
      err.name = 'GitlabRequestError';
      throw err;
    }
  };
};

export const createGitlabService = (config: GitlabApiConfig) => {
  const api = create(config);

  // Version
  // ---------------
  function version() {
    return api<GitlabResponse['Version']>('get', pathname.version());
  }

  // Project
  // ---------------
  function project(pid: GitlabProjectID) {
    return api<GitlabResponse['Project']>('get', pathname.project(pid));
  }

  project.createMergeRequest = (options: {
    id: GitlabProjectID;
    source_branch: string;
    target_branch: string;
    title: string;
    assignee_id?: number;
    description?: string;
    target_project_id?: string;
    labels?: string;
    milestone_id?: string;
    remove_source_branch?: boolean;
    allow_collaboration?: boolean;
    allow_maintainer_to_push?: boolean;
    squash?: boolean;
  }) =>
    api<GitlabResponse['MergeRequest']>(
      'post',
      pathname.mergeRequests(options.id),
      { body: options }
    );

  project.listMergeRequests = (
    pid: GitlabProjectID,
    options: Partial<{ state: 'opened' | 'closed' | 'locked' | 'merged' }> = {
      state: 'opened',
    }
  ) =>
    api<GitlabResponse['MergeRequest'][]>('get', pathname.mergeRequests(pid), {
      query: options,
    });

  project.listBranches = (pid: GitlabProjectID) =>
    api<GitlabResponse['Branch'][]>('get', pathname.branches(pid));

  return {
    version,
    project,
  };
};
