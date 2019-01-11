import opn from 'opn';
import { Arguments, CommandBuilder } from 'yargs';

import { ensureGitlabConfig, log } from '..';

export const command = 'open';
export const aliases = ['o'];
export const describe = 'Open project in Gitlab';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  const { url } = await ensureGitlabConfig(argv.cwd);
  const webUrl = `${url.origin}/${url.project_with_namespace}`;

  log.success(`Opening repository @ ${webUrl}`);
  opn(webUrl, { wait: false });
};
