import * as pathname from './pathname';

test('format project id', () => {
  expect(
    pathname.formatProjectId('project.name/gitlab-repo')
  ).toMatchInlineSnapshot(`"project.name%2Fgitlab-repo"`);
  expect(pathname.formatProjectId(1235)).toMatchInlineSnapshot(`1235`);
});

test('Gitlab API prefix', () => {
  expect(pathname.API_PREFIX).toMatchInlineSnapshot(`"/api/v4"`);
});

test('version path', () => {
  expect(pathname.version()).toMatchInlineSnapshot(`"/version"`);
});

test('project path', () => {
  expect(pathname.project(1)).toMatchInlineSnapshot(`"/projects/1"`);
  expect(pathname.project('hello/foo')).toMatchInlineSnapshot(
    `"/projects/hello%2Ffoo"`
  );
});

test('branches path', () => {
  expect(pathname.branches(1)).toMatchInlineSnapshot(
    `"/projects/1/repository/branches"`
  );
  expect(pathname.branches('project/name')).toMatchInlineSnapshot(
    `"/projects/project%2Fname/repository/branches"`
  );
});

test('merge requests path', () => {
  expect(pathname.mergeRequests(5)).toMatchInlineSnapshot(
    `"/projects/5/merge_requests"`
  );
  expect(pathname.mergeRequests('project/name')).toMatchInlineSnapshot(
    `"/projects/project%2Fname/merge_requests"`
  );
});
