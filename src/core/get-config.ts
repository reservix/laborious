import cosmiconfig from 'cosmiconfig';

import { ensureRepository } from '../git';
import { prompt } from '../utils';
import { LABORIOUS_NAMESPACE, LABORIOUS_CONFIG_NAMES } from './constants';
import { createConfig } from './create-config';
import { LaboriousInternalConfig } from './types';
import { validateLaboriousConfig } from './validate-config';

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

export const ensureLaboriousConfig = async (cwd: string) => {
  const config = await getLaboriousConfig(cwd);

  if (config) {
    return config;
  }

  const { init } = await prompt<{ init: boolean }>({
    type: 'confirm',
    name: 'init',
    message: `You task requires a laborious configuration. Create one?`,
    initial: true,
  });

  if (!init) {
    throw new Error(
      `A laborious configuration is required to perform your task. Aborting.`
    );
  }

  return createConfig(cwd);
};
