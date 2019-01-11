import { branchExists } from '../branch-exists';

jest.mock('execa', () =>
  jest.fn((_: string, args: string[]) => {
    const branch = args[args.length - 1];
    return branch === 'master' ? Promise.resolve() : Promise.reject();
  })
);

test('breanch exists', async () => {
  expect(branchExists('master')).resolves.toBeTruthy();
  expect(branchExists('foo')).resolves.toBeFalsy();
});
