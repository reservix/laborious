#!/usr/bin/env node

import chalk from 'chalk';
import yargs from 'yargs';

import { log } from './utils';

const header = chalk.blue(`
$$\\           $$\\                           $$\\
$$ |          $$ |                          \\__|
$$ | $$$$$$\\  $$$$$$$\\   $$$$$$\\   $$$$$$\\  $$\\  $$$$$$\\  $$\\   $$\\  $$$$$$$\\
$$ | \\____$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ $$ |$$  __$$\\ $$ |  $$ |$$  _____|
$$ | $$$$$$$ |$$ |  $$ |$$ /  $$ |$$ |  \\__|$$ |$$ /  $$ |$$ |  $$ |\\$$$$$$\\
$$ |$$  __$$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ |$$ |  $$ | \\____$$\\
$$ |\\$$$$$$$ |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$  |\\$$$$$$  |$$$$$$$  |
\\__| \\_______|\\_______/  \\______/ \\__|      \\__| \\______/  \\______/ \\_______/ `);

const argv = yargs
  .commandDir('./commands')
  .recommendCommands()
  .alias('help', 'h')
  .fail((msg, err) => {
    const message = msg ? msg : err.message;
    log.error(chalk.redBright(message));
    process.exit();
  })
  .usage(header).argv;

// Show help if no command was used.
if (!argv._[0]) {
  yargs.showHelp();
}
