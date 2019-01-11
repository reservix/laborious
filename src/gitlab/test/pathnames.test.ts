import * as pathnames from '../pathnames';

test('Gitlab API prefix', () => {
  expect(pathnames.API_PREFIX).toMatchInlineSnapshot(`"/api/v4"`);
});

test('version path', () => {
  expect(pathnames.version()).toMatchInlineSnapshot(`"/version"`);
});

test('project path', () => {
  expect(pathnames.project(1)).toMatchInlineSnapshot(`"/projects/1"`);
  expect(pathnames.project('hello/foo')).toMatchInlineSnapshot(
    `"/projects/hello%2Ffoo"`
  );
});

test('branches path', () => {
  expect(pathnames.branches(1)).toMatchInlineSnapshot(
    `"/projects/1/repository/branches"`
  );
  expect(pathnames.branches('project/name')).toMatchInlineSnapshot(
    `"/projects/project%2Fname/repository/branches"`
  );
});

test('merge requests path', () => {
  expect(pathnames.mergeRequests(5)).toMatchInlineSnapshot(
    `"/projects/5/merge_requests"`
  );
  expect(pathnames.mergeRequests('project/name')).toMatchInlineSnapshot(
    `"/projects/project%2Fname/merge_requests"`
  );
});
