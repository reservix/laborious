import { GitlabProjectID } from './types';

export const formatProjectId = (val: number | string) =>
  typeof val === 'number' ? val : encodeURIComponent(val);

// API Base
// ---------------
export const API_PREFIX = '/api/v4';

// API Paths
// ---------------
export const version = () => `/version`;

export const project = (pid: GitlabProjectID) =>
  `/projects/${formatProjectId(pid)}`;

export const branches = (pid: GitlabProjectID) =>
  `${project(pid)}/repository/branches`;

export const mergeRequests = (pid: GitlabProjectID) =>
  `${project(pid)}/merge_requests`;
