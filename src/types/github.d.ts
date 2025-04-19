// types/github.d.ts
export interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  display_title: string;
  run_number: number;
  head_branch: string;
  head_sha: string;
}

export interface GitHubWorkflowRunsResponse {
  total_count: number;
  workflow_runs: GitHubWorkflowRun[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  owner: {
    login: string;
  };
}

export type RepoWithRun = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  latest_run: GitHubWorkflowRun | null;
};
