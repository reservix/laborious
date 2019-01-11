import Enquirer from 'enquirer';

const enquirer = new Enquirer();
enquirer.register('editor', require('enquirer-prompt-editor'));

export class PromptCancelled extends Error {
  message = 'Prompt cannceled.';
}

// Hopefully we can remove this when enquirer hast better typings
// tslint:disable-next-line:no-shadowed-variable
type Arguments<R> = R extends (...args: infer R) => any ? R : never;
type EnquirerQuestions = Arguments<typeof enquirer.prompt>[0];

export const prompt = <T extends object = object>(
  questions: EnquirerQuestions
) =>
  enquirer.prompt(questions).catch(err => {
    // enquirer has a weird way to cancel prompts since 2.3
    if (err === '') {
      return Promise.reject(new PromptCancelled());
    }
    return Promise.reject(err);
  }) as Promise<T>;
