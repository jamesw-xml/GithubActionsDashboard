import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import type { GitHubWorkflowRun, RepoWithRun } from "@/types/github";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session }>> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function Dashboard() {
  const [repos, setRepos] = useState<RepoWithRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, tick] = useState<number>(0); // used for timer refresh
  const [orgs, setOrgs] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");

  // Fetch orgs on load
  useEffect(() => {
    const fetchOrgs = async () => {
      const res = await fetch("/api/github/orgs");
      const data = await res.json();
      setOrgs(data);
    };
    fetchOrgs();
  }, []);
  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      const res = await fetch(`/api/github/repos${selectedOrg ? `?org=${selectedOrg}` : ""}`);
      const data: RepoWithRun[] = await res.json();
      setRepos(data);
      setLoading(false);
    };
    fetchRepos();
  }, [selectedOrg]);

  useEffect(() => {
    const interval = setInterval(() => {
      tick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">Recently Run Pipelines</h1>
      <select
        value={selectedOrg}
        onChange={(e) => setSelectedOrg(e.target.value)}
        className="bg-[#2e2e2e] text-white px-3 py-2 rounded"
      >
        <option value="">All Orgs</option>
        {orgs.map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="divide-y divide-gray-700">
          {repos.map((repo) => (
            <div key={repo.id} className="flex items-center justify-between py-4">
              {/* Left: Repo Info */}
              <div className="flex flex-col">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:underline text-blue-400"
                >
                  {repo.full_name}
                </a>{" "}
                <a
                  href={`https://github.com/${repo.full_name}/commit/${repo.latest_run?.head_sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:underline"
                >
                  {repo.latest_run?.display_title || "N/A"}
                </a>
              </div>

              <div className="flex flex-col items-end text-sm gap-1">
                {/* Status, run number and branch */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const { icon, color } = getStatusBadge(repo.latest_run || null);
                    return <span className={color}>{icon}</span>;
                  })()}
                  {repo.latest_run?.html_url ? (
                    <a
                      href={repo.latest_run.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:underline"
                    >
                      #{repo.latest_run.run_number} - {repo.latest_run.head_branch || "N/A"}
                    </a>
                  ) : (
                    <span className="text-gray-300">
                      #{repo.latest_run?.run_number} - {repo.latest_run?.head_branch || "N/A"}
                    </span>
                  )}
                </div>

                {/* Time ago + duration */}
                <div className="text-gray-500 text-xs flex items-center gap-4">
                  <span>
                    {repo.latest_run?.updated_at
                      ? timeAgo(repo.latest_run.updated_at)
                      : "No update"}
                  </span>
                  <span>{repo.latest_run ? formatRunDuration(repo.latest_run) : "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Utility functions
function timeAgo(dateString: string) {
  const time = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = now - time;

  if (diff < 60000) return "<1 min ago";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// Format run duration
function formatRunDuration(run: GitHubWorkflowRun): string {
  const start = new Date(run.run_started_at).getTime();

  if (!start || isNaN(start)) return "-";

  if (run.status === "completed" || run.conclusion) {
    const end = new Date(run.updated_at).getTime();
    const ms = end - start;
    return humanDuration(ms);
  } else {
    const now = new Date().getTime();
    const ms = now - start;
    return `${run.status == "in_progress" ? "Running" : "Queued"}: ${humanDuration(ms)}`;
  }
}

// Convert ms to readable time
function humanDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}m ${remainingSecs}s`;
}

function getStatusBadge(run: GitHubWorkflowRun | null) {
  if (!run) return { icon: "❓", color: "text-gray-400" };

  if (run.status === "completed") {
    switch (run.conclusion) {
      case "success":
        return { icon: "✔", color: "text-green-500" };
      case "failure":
        return { icon: "✖", color: "text-red-500" };
      case "cancelled":
        return { icon: "⛔", color: "text-yellow-400" };
      default:
        return { icon: "✔", color: "text-gray-400" };
    }
  }

  if (run.status === "in_progress") {
    return { icon: "🔄", color: "text-blue-400" };
  }

  if (run.status === "queued") {
    return { icon: "⏳", color: "text-blue-300" };
  }

  return { icon: "❓", color: "text-gray-400" };
}
