import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import type { GitHubRepo, RepoWithRun, GitHubWorkflowRunsResponse } from "@/types/github";

const GITHUB_API = "https://api.github.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse<RepoWithRun[]>) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return Promise.reject({ error: "Unauthorized" });
  }

  try {
    // Step 1: Get all repos (user or org)
    const org = req.query.org;
    const url = org ? `${GITHUB_API}/orgs/${org}/repos` : `${GITHUB_API}/user/repos`;
    const repoRes = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const repos = await repoRes.json();

    const reposWithRuns = await Promise.all<RepoWithRun>(
      repos.map(async (repo: GitHubRepo) => {
        const runsRes = await fetch(
          `${GITHUB_API}/repos/${repo.owner.login}/${repo.name}/actions/runs?per_page=1`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              Accept: "application/vnd.github+json",
            },
          }
        );

        const runsData: GitHubWorkflowRunsResponse = await runsRes.json();
        const latestRun = runsData.workflow_runs?.[0];

        return {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          latest_run: latestRun ? latestRun : null,
        } as RepoWithRun;
      })
    );

    return res.status(200).json(reposWithRuns.filter((repo) => repo.latest_run !== null)); // Filter out repos without runs
  } catch (error) {
    console.error("Error fetching repos or workflows:", error);
    return Promise.reject({ error: "Failed to fetch GitHub data" });
  }
}
