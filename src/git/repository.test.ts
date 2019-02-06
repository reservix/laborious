import originalExeca from 'execa';
import {
  fastForward,
  fetch,
  getRefByUpstream,
  isRepositoryClean,
  isGitUrl,
} from './repository';

const execa = (originalExeca as any) as jest.Mock;
jest.mock('execa');

beforeEach(() => {
  execa.mockClear();
});

test('fast forward', async () => {
  await fastForward('cwd');
  expect(((execa as any) as jest.Mock).mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "git",
    Array [
      "merge",
      "--ff-only",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
]
`);
});

test('fetch', async () => {
  await fetch('cwd');
  expect(((execa as any) as jest.Mock).mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "git",
    Array [
      "fetch",
    ],
    Object {
      "cwd": "cwd",
    },
  ],
]
`);
});

test('getRefByUpstream', async () => {
  execa.mockResolvedValue({
    stdout:
      'tracking-example||origin/example\n' +
      'has-ref-to-example||origin/has-ref-to-example',
  });

  expect(await getRefByUpstream('origin/example')).toMatchInlineSnapshot(
    `"tracking-example"`
  );
  expect(await getRefByUpstream('origin/does-no-exist')).toMatchInlineSnapshot(
    `null`
  );
});

test('si repository clean', async () => {
  ((execa as any) as jest.Mock).mockResolvedValue({ stdout: '' });
  expect(isRepositoryClean('cwd')).resolves.toBeTruthy();

  ((execa as any) as jest.Mock).mockResolvedValue({ stdout: 'nope' });
  expect(isRepositoryClean('cwd')).resolves.toBeFalsy();
});

test('is valid git url', () => {
  const validURLs = [
    'git://github.com/ember-cli/ember-cli.git#ff786f9f',
    'git://github.com/ember-cli/ember-cli.git#gh-pages',
    'git://github.com/ember-cli/ember-cli.git#master',
    'git://github.com/ember-cli/ember-cli.git#Quick-Fix',
    'git://github.com/ember-cli/ember-cli.git#quick_fix',
    'git://github.com/ember-cli/ember-cli.git#v0.1.0',
    'git://host.xz/path/to/repo.git/',
    'git://host.xz/~user/path/to/repo.git/',
    'git@192.168.101.127:user/project.git',
    'git@github.com:user/project.git',
    'git@github.com:user/some-project.git',
    'git@github.com:user/some-project.git',
    'git@github.com:user/some_project.git',
    'git@github.com:user/some_project.git',
    'http://192.168.101.127/user/project.git',
    'http://github.com/user/project.git',
    'http://host.xz/path/to/repo.git/',
    'https://192.168.101.127/user/project.git',
    'https://github.com/user/project.git',
    'https://host.xz/path/to/repo.git/',
    'https://username::;*%$:@github.com/username/repository.git',
    'https://username:$fooABC@:@github.com/username/repository.git',
    'https://username:password@github.com/username/repository.git',
    'ssh://host.xz/path/to/repo.git/',
    'ssh://host.xz/path/to/repo.git/',
    'ssh://host.xz/~/path/to/repo.git',
    'ssh://host.xz/~user/path/to/repo.git/',
    'ssh://host.xz:port/path/to/repo.git/',
    'ssh://user@host.xz/path/to/repo.git/',
    'ssh://user@host.xz/path/to/repo.git/',
    'ssh://user@host.xz/~/path/to/repo.git',
    'ssh://user@host.xz/~user/path/to/repo.git/',
    'ssh://user@host.xz:port/path/to/repo.git/',
  ];

  validURLs.forEach(url => {
    expect(isGitUrl(url)).toBeTruthy();
  });

  const invalidURLs = [
    '/path/to/repo.git/',
    'file:///path/to/repo.git/',
    'file://~/path/to/repo.git/',
    'git@github.com:user/some_project.git/foo',
    'git@github.com:user/some_project.gitfoo',
    'host.xz:/path/to/repo.git/',
    'host.xz:path/to/repo.git',
    'host.xz:~user/path/to/repo.git/',
    'path/to/repo.git/',
    'rsync://host.xz/path/to/repo.git/',
    'user@host.xz:/path/to/repo.git/',
    'user@host.xz:path/to/repo.git',
    'user@host.xz:~user/path/to/repo.git/',
    '~/path/to/repo.git',
  ];

  invalidURLs.forEach(url => {
    expect(isGitUrl(url)).toBeFalsy();
  });
});
