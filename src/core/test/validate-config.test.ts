import { defaultConfig } from '../default-config';
import { validateLaboriousConfig } from '../validate-config';

test('merges with defaults', async () => {
  expect(await validateLaboriousConfig({})).toMatchInlineSnapshot(`
Object {
  "mr": Object {
    "default_branch": "master",
    "remove_source_branch": true,
    "squash": true,
    "types": Object {
      "docs": "📚",
      "feature": "✨",
      "fix": "🐛",
      "improvement": "🌈",
      "removal": "💩",
      "style": "🎨",
      "tag": "🔖",
      "test": "🚨",
      "tooling": "🛠",
    },
  },
}
`);

  const result = await validateLaboriousConfig({
    mr: {
      types: { feature: '🚀' },
    },
  });

  expect(result.mr.types.feature).toMatchInlineSnapshot(`"🚀"`);
});

test('default config is valid', async () => {
  expect(validateLaboriousConfig(defaultConfig)).resolves.not.toThrow();
});

test('allow optional "token_path"', async () => {
  expect(
    validateLaboriousConfig({ ...defaultConfig, token_path: '/custom/path' })
  ).resolves.not.toThrow();
});

test('throw if config is invalud', async () => {
  expect(
    validateLaboriousConfig({
      mr: {
        squash: 'truthy',
      },
    })
  ).rejects.toThrow();
});
