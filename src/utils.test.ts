import { pathExists } from 'fs-extra';
import { join } from 'path';
import { getCommandsDir } from './utils';

test('get commands dir', async () => {
  const dir = getCommandsDir();
  await expect(pathExists(dir)).resolves.toBeTruthy();
  await expect(pathExists(join(dir, 'init.ts'))).resolves.toBeTruthy();
});
