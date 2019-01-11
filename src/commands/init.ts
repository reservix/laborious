import { Arguments, CommandBuilder } from 'yargs';

import { createConfig, getLaboriousConfig, log, prompt } from '..';

export const command = 'init';
export const aliases = ['i'];
export const describe = 'Initialize laborious.';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  let config = await getLaboriousConfig(argv.cwd);

  if (config) {
    const { override } = await prompt<{ override: boolean }>({
      type: 'confirm',
      name: 'override',
      message:
        `Found a configuration file (${config._.file}).\n` +
        `Are you sure you want to create a new one?`,
      initial: false,
    });

    if (!override) {
      return;
    }
  }

  log.info(`Creating a new config file:`);
  config = await createConfig(argv.cwd);
  log.success(`Config file created @ ${config._.file}`);
};
