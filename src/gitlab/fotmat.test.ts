import { branchesToChoiceList, mergeRequestsToChoiceList } from './format';

test('branches to choice list', () => {
  expect(
    branchesToChoiceList([
      {
        name: 'master',
        default: true,
      },
      {
        name: 'feature',
        default: false,
      },
    ])
  ).toMatchInlineSnapshot(`
Array [
  Separator {
    "line": "[2m[0m[4m[24m[0m[22m
[2m[0m[4mBranch[24m[0m[22m",
    "type": "separator",
  },
  Object {
    "name": "🌱  master[2m (default)[22m",
    "value": Object {
      "branch": "master",
      "name": "master",
      "type": "Branch",
    },
  },
  Object {
    "name": "🌱  feature",
    "value": Object {
      "branch": "feature",
      "name": "feature",
      "type": "Branch",
    },
  },
]
`);

  // Empty
  expect(branchesToChoiceList([])).toMatchInlineSnapshot(`
Array [
  Separator {
    "line": "[2m[0m[4m[24m[0m[22m
[2m[0m[4mBranch[24m[0m[22m",
    "type": "separator",
  },
  Object {
    "disabled": "",
    "name": "None found.",
  },
]
`);
});

test('merge requests to list choice', () => {
  expect(
    mergeRequestsToChoiceList([
      {
        iid: 1,
        title: 'MR 1',
        source_branch: 'feature-1',
      },
    ])
  ).toMatchInlineSnapshot(`
Array [
  Separator {
    "line": "[2m[0m[4m[24m[0m[22m
[2m[0m[4mMerge Request[24m[0m[22m",
    "type": "separator",
  },
  Object {
    "name": "MR 1 [2m(#1)[22m",
    "value": Object {
      "branch": "feature-1",
      "name": "MR 1",
      "type": "Merge Request",
    },
  },
]
`);

  // Empty
  expect(mergeRequestsToChoiceList([])).toMatchInlineSnapshot(`
Array [
  Separator {
    "line": "[2m[0m[4m[24m[0m[22m
[2m[0m[4mMerge Request[24m[0m[22m",
    "type": "separator",
  },
  Object {
    "disabled": "",
    "name": "None found.",
  },
]
`);
});
