import { homedir } from 'os';

// Laborious
// ---------------
export const LABORIOUS_NAMESPACE = 'laborious';
export const LABORIOUS_GITLAB_TOKEN_PATH = `${homedir()}/.${LABORIOUS_NAMESPACE}`;

export const LABORIOUS_DEFAULT_CONFIG_NAME = `${LABORIOUS_NAMESPACE}.json`;
export const LABORIOUS_CONFIG_NAMES = [
  'package.json',
  LABORIOUS_DEFAULT_CONFIG_NAME,
  `.${LABORIOUS_NAMESPACE}rc`,
  `.${LABORIOUS_NAMESPACE}.json`,
  `.${LABORIOUS_NAMESPACE}.yaml`,
  `.${LABORIOUS_NAMESPACE}.yml`,
  `.${LABORIOUS_NAMESPACE}.js`,
  `${LABORIOUS_NAMESPACE}.config.js`,
];
