let mockedAnswers: { [name: string]: any } = {};
export const __setAnswers = (answers: { [name: string]: any }) => {
  mockedAnswers = answers;
};

type Questions = {
  name: string;
  default?: any;
};

export const prompt = jest
  .fn()
  .mockImplementation((questions: Questions | Questions[]) => {
    const input = Array.isArray(questions) ? questions : [questions];
    return Promise.resolve(
      input.reduce((answers, { name, default: def }) => {
        answers[name] =
          name in mockedAnswers
            ? mockedAnswers[name]
            : typeof def === 'undefined'
            ? null
            : def;
        return answers;
      }, {})
    );
  });
