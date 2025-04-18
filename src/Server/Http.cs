using Shared;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Server
{
    public class Http
    {
        private readonly HttpClient _client;
        private readonly Settings _settings;

        public Http(HttpClient client, Settings settings)
        {
            _client = client;
            _settings = settings;
        }

        public async Task<IList<WorkflowRun>> Get()
        {
            var repos = await GetRepos();
            var results = new ConcurrentBag<WorkflowRun>();

            await Parallel.ForEachAsync(repos, async (repo, x) =>
            {
                var run = await GetLatestRun(repo);
                if (run != null)
                {
                    results.Add(run);
                }
            });

            return results.OrderBy(x=>x.Repository.Name).ToList();
        }

        private async Task<List<string>> GetRepos()
        {
            var json = await _client.GetStringAsync($"/orgs/{_settings.GithubOrg}/repos?per_page=100");
            var doc = JsonDocument.Parse(json);
            return doc.RootElement.EnumerateArray()
                .Select(r => r.GetProperty("name").GetString()!)
                .ToList();
        }

        private async Task<WorkflowRun> GetLatestRun(string repo)
        {
            var json = await _client.GetStringAsync($"/repos/{_settings.GithubOrg}/{repo}/actions/runs?per_page=1");
            var doc = JsonDocument.Parse(json);
            var run = doc.RootElement.GetProperty("workflow_runs").EnumerateArray().FirstOrDefault();
            if (run.ValueKind == JsonValueKind.Undefined) return null;
            var x = run.Deserialize<WorkflowRun>(new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return x;
        }
    }
}
