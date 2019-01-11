import { Arguments, CommandBuilder } from 'yargs';
import { ensureGitlabService, log } from '..';

export const command = 'ping';
export const describe = 'Ping configured Gitlab API';

export const builder: CommandBuilder<any, any> = yargs =>
  yargs.default('cwd', process.cwd());

export const handler = async (argv: Arguments<{ cwd: string }>) => {
  const { gitlab } = await ensureGitlabService(argv.cwd);

  try {
    const { version } = await gitlab.version();
    log.success(`Gitlab (v${version}) connection works!`);
  } catch {
    log.error(`Gitlab connection does not work!`);
  }
};
