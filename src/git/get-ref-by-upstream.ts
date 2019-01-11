import execa from 'execa';
import { EOL } from 'os';

const SEPARATOR = '||';

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
