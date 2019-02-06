import chalk from 'chalk';
import { log, prompt, LaboriousMergeRequestConfig } from '..';

export const createMessage = async (
  config: LaboriousMergeRequestConfig,
  label = 'Your message'
) => {
  const answers = await prompt<{
    type: string;
    title: string;
    description: string;
  }>([
    {
      type: 'select',
      name: 'type',
      message: 'MR Type:',
      choices: Object.entries(config.types).map(([name, emoji]) => ({
        message: `${emoji}  ${name}`,
        value: emoji,
      })),
    },
    {
      type: 'input',
      name: 'title',
      message: 'MR Title:',
      validate: msg =>
        msg.length > 5
          ? true
          : "The title seems a little short, don't you think? 🧐",
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Summarize your changes:',
    },
  ]);

  log.info(chalk.bold(`${label}:`));
  log.indent(
    chalk.italic.grey(
      `${answers.type}  ${answers.title}\n\n${answers.description}`
    ),
    '|  '
  );
  log('');

  return answers;
};
