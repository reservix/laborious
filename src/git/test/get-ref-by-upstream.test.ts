import { getRefByUpstream } from '../get-ref-by-upstream';

jest.mock('execa', () =>
  jest.fn().mockResolvedValue({
    stdout:
      'tracking-example||origin/example\n' +
      'has-ref-to-example||origin/has-ref-to-example',
  })
);

test('getRefByUpstream', async () => {
  expect(await getRefByUpstream('origin/example')).toMatchInlineSnapshot(
    `"tracking-example"`
  );
  expect(await getRefByUpstream('origin/does-no-exist')).toMatchInlineSnapshot(
    `null`
  );
});
