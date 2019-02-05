/* eslint-disable @typescript-eslint/no-var-requires */
const { isMockFunction } = require('jest-mock');
const { toMatchSnapshot } = require('jest-snapshot');

const getLastArgsFromMock = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1];

expect.extend({
  toMatchLastCallSnapshot(received) {
    return isMockFunction(received)
      ? toMatchSnapshot.call(
          this,
          getLastArgsFromMock(received),
          'toMatchLastCallSnapshot'
        )
      : {
          actual: received,
          pass: false,
          message: () =>
            this.utils.matcherHint('.toMatchLastCallSnapshot') +
            '\n\n' +
            `Expected input to be an "jest.Mock".`,
        };
  },
});
