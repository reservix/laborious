# [0.6.0](https://github.com/reservix/laborious/compare/v0.5.0...v0.6.0) (2019-02-08)

### Refactoring & Improvements

- Add spinner when git is checked and updated. ([70f570c](https://github.com/reservix/laborious/commit/70f570c))
- Move "parseRemoteUrl" util into repository file ([3abda46](https://github.com/reservix/laborious/commit/3abda46))
- Move all utils to one file ([0b1fd0c](https://github.com/reservix/laborious/commit/0b1fd0c))
- Move GitlabReponse types to types file ([0d3a022](https://github.com/reservix/laborious/commit/0d3a022))
- Move to inquirer ([855e62c](https://github.com/reservix/laborious/commit/855e62c))
- Restrcture "gitlab" domain ([908651c](https://github.com/reservix/laborious/commit/908651c))
- Restructure "core" domain ([56d0121](https://github.com/reservix/laborious/commit/56d0121))
- Restructure "git" domain ([84d6d07](https://github.com/reservix/laborious/commit/84d6d07))
- Extract MR message to own file + add spinner (#8) ([513d34e](https://github.com/reservix/laborious/commit/513d34e)), closes [#8](https://github.com/reservix/laborious/issues/8)

### Bug Fixes

- Move "jest-mock-proxy" to dev depdencies ([f8e83d0](https://github.com/reservix/laborious/commit/f8e83d0))

### Tooling

- Update prettier and conventional-changelog ([4bf2644](https://github.com/reservix/laborious/commit/4bf2644))

### Miscellaneous

- Docs docs docs ([9ce7fe5](https://github.com/reservix/laborious/commit/9ce7fe5))
- Wip: draft MR with review + change target branch ([299421f](https://github.com/reservix/laborious/commit/299421f))

# [0.5.0](https://github.com/reservix/laborious/compare/v0.4.3...v0.5.0) (2019-02-05)

### Features

- Make location of gitlab token configurable ([971d69f](https://github.com/reservix/laborious/commit/971d69f)), closes [#7](https://github.com/reservix/laborious/issues/7)

### Tooling

- Create changelog when version is incremented ([f6e7edf](https://github.com/reservix/laborious/commit/f6e7edf))
- Move to eslint ([19a76c3](https://github.com/reservix/laborious/commit/19a76c3))

### Documentation

- Update changelog. ([9bdc2ab](https://github.com/reservix/laborious/commit/9bdc2ab))

## [0.4.3](https://github.com/reservix/laborious/compare/v0.4.1...v0.4.3) (2019-01-25)

### Tooling

- Update "conventional-changelog-emojis" ([847f930](https://github.com/reservix/laborious/commit/847f930))
- Update `yup` ([5ab3c8f](https://github.com/reservix/laborious/commit/5ab3c8f))
- Update dev dependencies ([4257823](https://github.com/reservix/laborious/commit/4257823))

## [0.4.1](https://github.com/reservix/laborious/compare/v0.4.0...v0.4.1) (2019-01-25)

### Documentation

- Add changelog generator ([df1f606](https://github.com/reservix/laborious/commit/df1f606))

# [0.4.0](https://github.com/reservix/laborious/compare/c64e8fd...v0.4.0) (2019-01-25)

### Features

- API to resolve commands path. ([91e3bcf](https://github.com/reservix/laborious/commit/91e3bcf))
- Use "commit-emojis" ([64b333b](https://github.com/reservix/laborious/commit/64b333b))
- Check branch status before creating an MR. (#4) ([f98ea4a](https://github.com/reservix/laborious/commit/f98ea4a)), closes [#4](https://github.com/reservix/laborious/issues/4) [#2](https://github.com/reservix/laborious/issues/2)

### Refactoring & Improvements

- Build declartion files. ([28c32bb](https://github.com/reservix/laborious/commit/28c32bb))

### Bug Fixes

- Correclty handle unauthorized error from Gitlab. ([5f762dc](https://github.com/reservix/laborious/commit/5f762dc))
- Correctly calculate unpushed commits. ([91de786](https://github.com/reservix/laborious/commit/91de786))
- Correctly pass down "cwd" ([a25147d](https://github.com/reservix/laborious/commit/a25147d))
- Only list open MRs in checkout (#3) ([f0ea7bb](https://github.com/reservix/laborious/commit/f0ea7bb)), closes [#3](https://github.com/reservix/laborious/issues/3) [#2](https://github.com/reservix/laborious/issues/2)

### Tooling

- Add `typescript-tslint-plugin` to dependencies ([fa014ab](https://github.com/reservix/laborious/commit/fa014ab))
- Add travis ([e9308ea](https://github.com/reservix/laborious/commit/e9308ea))
- Configure yarn version message ([04315c0](https://github.com/reservix/laborious/commit/04315c0))

### Documentation

- Add badges \o/ ([a025175](https://github.com/reservix/laborious/commit/a025175))
- Add travis badge ([535560d](https://github.com/reservix/laborious/commit/535560d))
- Correct information about default branch. ([663e668](https://github.com/reservix/laborious/commit/663e668))
- Document ping command ([493a47d](https://github.com/reservix/laborious/commit/493a47d))
- Fix badges ([789c194](https://github.com/reservix/laborious/commit/789c194))
- Fix formatting. ([9f09e57](https://github.com/reservix/laborious/commit/9f09e57))
- Fix typo in build badge... ([4ae219e](https://github.com/reservix/laborious/commit/4ae219e))
- Formatting + bigger image ([446324c](https://github.com/reservix/laborious/commit/446324c))

### Miscellaneous

- Move to Github ([c64e8fd](https://github.com/reservix/laborious/commit/c64e8fd))
- Update dependencies ([35c05ba](https://github.com/reservix/laborious/commit/35c05ba))
