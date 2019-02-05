export type Commit = {
  author_email: string;
  author_name: string;
  authored_date: string;
  committed_date: string;
  committer_email: string;
  committer_name: string;
  id: string;
  short_id: string;
  title: string;
  message: string;
  parent_ids: string[];
};

export type User = {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
};

export interface GitlabResponse {
  Version: { version: string; revision: string };

  Project: {
    id: number;
    description: null;
    default_branch: string;
    visibility: string;
    ssh_url_to_repo: string;
    http_url_to_repo: string;
    web_url: string;
    readme_url: string;
    tag_list: string[];
    owner: { id: number; name: string; created_at: string };
    name: string;
    name_with_namespace: string;
    path: string;
    path_with_namespace: string;
    issues_enabled: boolean;
    open_issues_count: number;
    merge_requests_enabled: boolean;
    jobs_enabled: boolean;
    wiki_enabled: boolean;
    snippets_enabled: boolean;
    resolve_outdated_diff_discussions: boolean;
    container_registry_enabled: boolean;
    created_at: string;
    last_activity_at: string;
    creator_id: number;
    namespace: {
      id: number;
      name: string;
      path: string;
      kind: string;
      full_path: string;
    };
    import_status: string;
    import_error: null;
    permissions: Record<
      'project_access' | 'group_access',
      { access_level: number; notification_level: number }
    >;
    archived: boolean;
    avatar_url: string;
    license_url: string;
    license: {
      key: string;
      name: string;
      nickname: string;
      html_url: string;
      source_url: string;
    };
    shared_runners_enabled: boolean;
    forks_count: number;
    star_count: number;
    runners_token: string;
    public_jobs: boolean;
    shared_with_groups: {
      group_id: number;
      group_name: string;
      group_access_level: number;
    }[];
    repository_storage: string;
    only_allow_merge_if_pipeline_succeeds: boolean;
    only_allow_merge_if_all_discussions_are_resolved: boolean;
    printing_merge_requests_link_enabled: boolean;
    request_access_enabled: boolean;
    merge_method: string;
    approvals_before_merge: number;
    statistics: {
      commit_count: number;
      storage_size: number;
      repository_size: number;
      lfs_objects_size: number;
      job_artifacts_size: number;
    };
    _links: {
      self: string;
      issues: string;
      merge_requests: string;
      repo_branches: string;
      labels: string;
      events: string;
      members: string;
    };
  };

  Branch: {
    name: string;
    merged: boolean;
    protected: boolean;
    default: boolean;
    developers_can_push: boolean;
    developers_can_merge: boolean;
    can_push: boolean;
    commit: Commit;
  };

  MergeRequest: {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    merged_by: User | null;
    merged_at: User | null;
    closed_by: User | null;
    closed_at: User | null;
    target_branch: string;
    source_branch: string;
    upvotes: number;
    downvotes: number;
    author: User;
    assignee: User | null;
    source_project_id: number;
    target_project_id: number;
    labels: any[];
    work_in_progress: boolean;
    milestone: null;
    merge_when_pipeline_succeeds: boolean;
    merge_status: string;
    sha: null;
    merge_commit_sha: null;
    user_notes_count: number;
    discussion_locked: null;
    should_remove_source_branch: null;
    force_remove_source_branch: null;
    web_url: string;
    time_stats: {
      time_estimate: number;
      total_time_spent: number;
      human_time_estimate: string | null;
      human_total_time_spent: string | null;
    };
    squash: boolean;
    subscribed: boolean;
    changes_count: null;
    latest_build_started_at: null;
    latest_build_finished_at: null;
    first_deployed_to_production_at: null;
    pipeline: null;
    diff_refs: {
      base_sha: string;
      head_sha: string;
      start_sha: string;
    };
  };
}
