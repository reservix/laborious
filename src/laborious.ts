import { resolve } from 'path';
import {
  createGitlabService,
  ensureGitlabToken,
  ensureRemoteUrl,
  getLaboriousConfig,
  LABORIOUS_GITLAB_TOKEN_PATH,
  LABORIOUS_NAMESPACE,
  LaboriousMessageTypes,
  parseRemoteUrl,
  prompt,
} from '.';

/**
 * Get `path` where the Gitlab auth token is stored.
 * 1. From the configured path (via laborious config)
 * 2. From the default path
 *
 * @param cwd current working directory
 * @returns token path
 */
export const getGitlabTokenPath = async (cwd: string) => {
  const laborious = await getLaboriousConfig(cwd);

  if (laborious !== null && laborious.token_path) {
    return resolve(laborious._.project, laborious.token_path);
  }

  return LABORIOUS_GITLAB_TOKEN_PATH;
};

/**
 * Get gitlab configuration.
 * Will prompt the user to create a gitlab auth token if none can be found.
 *
 * @param cwd current working directory
 * @returns Gitlab configuration
 */
export const ensureGitlabConfig = async (cwd: string) => {
  const remote = await ensureRemoteUrl(cwd);
  const url = parseRemoteUrl(remote);

  const path = await getGitlabTokenPath(cwd);
  const token = await ensureGitlabToken(path, url.origin);
  return { url, token };
};

/**
 * Get a configured Gitlab service.
 * Will prompt the user to create a gitlab config if none can be found.
 *
 * @param cwd current working directory
 * @returns Gitlab service and the Gitlab URL
 */
export const ensureGitlabService = async (cwd: string) => {
  const { url, token } = await ensureGitlabConfig(cwd);
  const gitlab = createGitlabService({
    baseUrl: url.origin,
    token,
    userAgent: `${LABORIOUS_NAMESPACE}`,
  });

  return { gitlab, url };
};

/**
 * The message type
 */
export type Message = {
  type: string;
  title: string;
  description: string;
};

/**
 * Create a message for a commit/merge request/... that conforms
 * https://github.com/sebald/conventional-changelog-emojis
 *
 * @param types available types of messages
 * @param initial initial message
 * @returns the message
 */
export const createMessage = async (
  types: LaboriousMessageTypes,
  initial: Partial<Message> = {}
) => {
  const message = await prompt<Message>([
    {
      type: 'list',
      name: 'type',
      message: 'MR Type:',
      default: initial.type,
      pageSize: Object.keys(types).length,
      choices: Object.entries(types).map(([name, emoji]) => ({
        name: `${emoji}  ${name}`,
        value: emoji,
      })),
    },
    {
      type: 'input',
      name: 'title',
      message: 'MR Title:',
      default: initial.title,
      validate: msg =>
        msg.length > 5
          ? true
          : "The title seems a little short, don't you think? 🧐",
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Summarize your changes:',
      default: initial.description,
    },
  ]);

  return message;
};
