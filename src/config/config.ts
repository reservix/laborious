import emojis from 'commit-emojis';
import cosmiconfig from 'cosmiconfig';
import { outputJson } from 'fs-extra';
import merge from 'lodash.merge';
import { homedir } from 'os';
import { object, lazy, boolean, string, ValidationError } from 'yup';

import { ensureRepository } from '../git';
import { log, prompt } from '../utils';
import {
  LaboriousConfig,
  LaboriousMergeRequestConfig,
  LaboriousInternalConfig,
} from './types';

export const LABORIOUS_NAMESPACE = 'laborious';
export const LABORIOUS_GITLAB_TOKEN_PATH = `${homedir()}/.${LABORIOUS_NAMESPACE}`;

export const LABORIOUS_DEFAULT_CONFIG_NAME = `${LABORIOUS_NAMESPACE}.json`;
export const LABORIOUS_CONFIG_NAMES = [
  'package.json',
  LABORIOUS_DEFAULT_CONFIG_NAME,
  `.${LABORIOUS_NAMESPACE}rc`,
  `.${LABORIOUS_NAMESPACE}.json`,
  `.${LABORIOUS_NAMESPACE}.yaml`,
  `.${LABORIOUS_NAMESPACE}.yml`,
  `.${LABORIOUS_NAMESPACE}.js`,
  `${LABORIOUS_NAMESPACE}.config.js`,
];

/**
 * The default laborious configuration
 */
export const defaultConfig: LaboriousConfig = {
  mr: {
    types: emojis,
    squash: true,
    remove_source_branch: true,
    default_branch: 'master',
  },
};

/**
 * Laborious config schema
 */
const laboriousConfigFileSchema = object<LaboriousConfig>({
  mr: object({
    squash: boolean(),
    remove_source_branch: boolean(),
    default_branch: string(),
    types: lazy(o => {
      if (o === undefined) {
        return object();
      }

      return object(
        Object.keys(o).reduce((acc, key) => {
          acc[key] = string();
          return acc;
        }, {})
      );
    }),
  }),
  token_path: string(),
});

/**
 * Test if given `val` is a valid laborious configuration.
 *
 * @param val value under test
 * @returns laborious configuration
 */
export const validateLaboriousConfig = async (val: any) => {
  try {
    const result = await laboriousConfigFileSchema.validate(val);
    return merge(defaultConfig, result);
  } catch (err) {
    const { errors } = err as ValidationError;
    throw new Error(
      `Config file is erroneous. Please correct the following properties:\n` +
        errors.map(msg => `  - ${msg}`).join('\n')
    );
  }
};

/**
 * Create a laborious config and save it to `cwd`.
 *
 * @param cwd current working directory
 * @returns the laborious config
 */
export const createConfig = async (
  cwd: string
): Promise<LaboriousInternalConfig> => {
  const projectPath = await ensureRepository(cwd);

  log.info('Please answer the following questions about Merge Requests!');

  const mr = await prompt<
    Pick<
      LaboriousMergeRequestConfig,
      'default_branch' | 'squash' | 'remove_source_branch'
    >
  >([
    {
      type: 'input',
      name: 'default_branch',
      message: 'Name of the default target branch for MRs:',
      default: defaultConfig.mr.default_branch,
    },
    {
      type: 'confirm',
      name: 'squash',
      message: 'Should MRs be squashed?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'remove_source_branch',
      message: 'Remove source branch after merge?',
      default: true,
    },
  ]);

  const contents = { mr };
  const configFilePath = `${projectPath}/${LABORIOUS_DEFAULT_CONFIG_NAME}`;
  await outputJson(configFilePath, contents, {
    spaces: 2,
  });

  const config = await validateLaboriousConfig(contents);

  return {
    ...config,
    _: { file: configFilePath, project: projectPath },
  };
};

/**
 * Read the laborious configuration from file.
 *
 * @param cwd current working directory
 * @returns the laborious configuration
 */
export const getLaboriousConfig = async (
  cwd: string
): Promise<LaboriousInternalConfig | null> => {
  const projectPath = await ensureRepository(cwd);

  const explorer = cosmiconfig(LABORIOUS_NAMESPACE, {
    stopDir: projectPath,
    searchPlaces: LABORIOUS_CONFIG_NAMES,
    transform: result => {
      if (result && result.config && typeof result.config !== 'object') {
        throw new Error(
          `Config must be an object, ` +
            `but received ${typeof result.config} in "${result.filepath}."`
        );
      }

      return result;
    },
  });
  const loaded = await explorer.search(cwd);

  if (!loaded || loaded.isEmpty) {
    return null;
  }

  const config = await validateLaboriousConfig(loaded.config);

  return {
    ...config,
    _: { file: loaded.filepath, project: projectPath },
  };
};

/**
 * Read the laborious configuration from file.
 * Will prompt the user to create a configuration file if none was found.
 *
 * @param cwd current working directory
 * @returns the laborious configuration
 */
export const ensureLaboriousConfig = async (cwd: string) => {
  const config = await getLaboriousConfig(cwd);

  if (config) {
    return config;
  }

  const { init } = await prompt<{ init: boolean }>({
    type: 'confirm',
    name: 'init',
    message: `You task requires a laborious configuration. Create one?`,
    default: true,
  });

  if (!init) {
    throw new Error(
      `A laborious configuration is required to perform your task. Aborting.`
    );
  }

  return createConfig(cwd);
};
