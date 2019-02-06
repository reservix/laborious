export type LaboriousMergeRequestConfig = {
  types: { [name: string]: string };
  squash: boolean;
  default_branch: string;
  remove_source_branch: boolean;
};

export type LaboriousConfig = {
  mr: LaboriousMergeRequestConfig;
  token_path?: string;
};

export type LaboriousInternalConfig = LaboriousConfig & {
  _: {
    file: string;
    project: string;
  };
};
