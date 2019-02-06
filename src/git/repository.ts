/* eslint-disable @typescript-eslint/camelcase */
import execa from 'execa';
import findUp from 'find-up';
import gitUrl from 'git-url-parse';
import { dirname } from 'path';
import { EOL } from 'os';
import { URL } from 'url';
import { log, prompt } from '..';

/**
 * Stolen from: https://github.com/jonschlinkert/is-git-url
 * (too lazy to add typings)
 */
const GIT_URL_REGEX = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|#[-\d\w._]+?)$/;
export const isGitUrl = (val: string) => GIT_URL_REGEX.test(val);

/**
 * Get repository root folder, starting from `cwd`.
 *
 * @param cwd current working directory
 * @returns repository root folder
 */
export const getRepository = async (cwd: string) => findUp('.git', { cwd });

/**
 * Try to find repository, starting from `cwd`. If none is found, ask user
 * if one should be initialized.
 *
 * @param cwd current working directory
 * @returns repository root folder
 */
export const ensureRepository = async (cwd: string) => {
  const gitPath = await getRepository(cwd);

  if (gitPath) {
    return dirname(gitPath);
  }

  log.warning('No git repository found.');
  const { initGit } = await prompt<{ initGit: boolean }>({
    type: 'confirm',
    name: 'init',
    message: `Do you want to initialize a git repository in "${cwd}"?`,
    default: true,
  });

  if (!initGit) {
    throw new Error(`Aborting. laborious requires a git repository to work.`);
  }

  return init(cwd);
};

/**
 * Initialize a repository at `cwd`.
 *
 * @param cwd current working directory
 * @returns cwd
 */
export const init = async (cwd: string) => {
  await execa('git', ['init']);
  return cwd;
};

/**
 * Fetch repository updates.
 *
 * @param cwd current working directory
 * @returns resolves when fetch was successful
 */
export const fetch = async (cwd: string) => {
  await execa('git', ['fetch'], { cwd });
};

/**
 * Do a fast forward merge.
 *
 * @param cwd current working directory
 * @returns resolves when merge was successful
 */
export const fastForward = async (cwd: string) => {
  await execa('git', ['merge', '--ff-only'], { cwd });
};

/**
 * Get remote URL from repository in `cwd`.
 *
 * @param cwd current working directory
 * @returns remote url
 */
export const getRemoteUrl = async (cwd: string) => {
  const { stdout } = await execa('git', ['ls-remote', '-h', '--get-url'], {
    cwd,
  });
  return stdout.trim();
};

/**
 * Try to get remote URL from repository. If no repository can be found,
 * ask the user if one should initialized and set a remote URL.
 *
 * @param cwd current working directory
 * @returns remote url
 */
export const ensureRemoteUrl = async (cwd: string) => {
  const gitPath = await ensureRepository(cwd);

  try {
    return await getRemoteUrl(gitPath);
  } catch {
    log.warning('No remote configured.');
    const { remote } = await prompt<{ remote: string }>({
      type: 'input',
      name: 'remote',
      message: 'Remote URL:',
      validate: async val => isGitUrl(val),
    });

    if (!remote) {
      throw new Error(`Aborting. laborious requires a remote to work.`);
    }

    await execa('git', ['remote', 'add', 'origin', remote], { cwd });
    log.success(`Added ${remote} as origin.`);

    return remote;
  }
};

/**
 * Check if repository is clean (contains no uncommited updates and un-stage files).
 *
 * @param cwd current working directory
 * @returns if the repository is clean
 */
export const isRepositoryClean = async (cwd: string) => {
  const { stdout } = await execa(
    'git',
    ['status', '--untracked-files=no', '--porcelain'],
    { cwd }
  );
  return stdout === '';
};

/**
 * Check if repository is clean (contains no uncommited updates and un-stage files).
 * Will prompt the user to create a repository if none is initialized yet.
 *
 * @param cwd current working directory
 * @returns if the repository is clean
 */
export const ensureGitClean = async (cwd: string) => {
  await ensureRepository(cwd);
  return isRepositoryClean(cwd);
};

const SEPARATOR = '||';

/**
 * Finds the corresponding remote reference for a local reference.
 * For example, find the tracking branch on remote.
 *
 * @param upstream name of the upstream (usually "origin")
 * @param cwd current working directory
 * @returns name of the remote ref or `null` if it can not be found
 */
export const getRefByUpstream = async (
  upstream: string,
  cwd = process.cwd()
) => {
  try {
    const { stdout } = await execa(
      'git',
      [
        'for-each-ref',
        '--format',
        `%(refname:short)${SEPARATOR}%(upstream:short)`,
        '--points-at',
        upstream,
        'refs/heads',
      ],
      { cwd }
    );

    const item = stdout.split(EOL).find(val => val.endsWith(upstream));
    return item ? item.split(SEPARATOR)[0] : null;
  } catch {
    return null;
  }
};

export const parseRemoteUrl = (remoteUrl: string) => {
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
