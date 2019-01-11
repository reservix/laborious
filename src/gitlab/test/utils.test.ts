import { parseGitUrl, formatProjectId } from '../utils';

test('parse git url', () => {
  expect(parseGitUrl('git@git.example.com:project.name/gitlab-repo.git'))
    .toMatchInlineSnapshot(`
Object {
  "namespace": "project.name",
  "origin": "https://git.example.com",
  "project": "gitlab-repo",
  "project_with_namespace": "project.name/gitlab-repo",
}
`);
});

test('format project id', () => {
  expect(formatProjectId('project.name/gitlab-repo')).toMatchInlineSnapshot(
    `"project.name%2Fgitlab-repo"`
  );
  expect(formatProjectId(1235)).toMatchInlineSnapshot(`1235`);
});
