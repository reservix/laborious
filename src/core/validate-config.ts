import { object, lazy, boolean, string, ValidationError } from 'yup';
import merge from 'lodash.merge';

import { defaultConfig } from './default-config';
import { LaboriousConfig } from './types';

const laboriousConfigFileSchema = object<LaboriousConfig>({
  mr: object({
    squash: boolean(),
    remove_source_branch: boolean(),
    default_branch: string(),
    types: lazy(o => {
      if (o === undefined) {
        return object();
      }

      return object(
        Object.keys(o).reduce((acc, key) => {
          acc[key] = string();
          return acc;
        }, {})
      );
    }),
  }),
});

export const validateLaboriousConfig = async (val: any) => {
  try {
    const result = await laboriousConfigFileSchema.validate(val);
    return merge(defaultConfig, result);
  } catch (err) {
    const { errors } = err as ValidationError;
    throw new Error(
      `Config file is erroneous. Please correct the following properties:\n` +
        errors.map(msg => `  - ${msg}\n`)
    );
  }
};
