import { parseGitUrl } from './parse-git-url';

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
