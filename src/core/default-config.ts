import { LaboriousConfig } from './types';

export const defaultConfig: LaboriousConfig = {
  mr: {
    // Inspired by https://github.com/dannyfritz/commit-message-emoji
    types: {
      docs: '📚',
      feature: '✨',
      fix: '🐛',
      improvement: '🌈',
      removal: '💩',
      style: '🎨',
      tag: '🔖',
      test: '🚨',
      tooling: '🛠',
    },
    squash: true,
    remove_source_branch: true,
    default_branch: 'master',
  },
};
