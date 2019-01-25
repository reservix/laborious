import { LaboriousConfig } from './types';
import emojis from 'commit-emojis';

export const defaultConfig: LaboriousConfig = {
  mr: {
    types: emojis,
    squash: true,
    remove_source_branch: true,
    default_branch: 'master',
  },
};
