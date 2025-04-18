using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared
{
    public class WorkflowRun
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string NodeId { get; set; }
        public int CheckSuiteId { get; set; }
        public string CheckSuiteNodeId { get; set; }
        public string? HeadBranch { get; set; }
        public string HeadSha { get; set; }
        public string Path { get; set; }
        public int RunNumber { get; set; }
        public int RunAttempt { get; set; }
        public string Event { get; set; }
        public string? Status { get; set; }
        public string? Conclusion { get; set; }
        public int WorkflowId { get; set; }
        public string Url { get; set; }
        public string Html_Url { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string JobsUrl { get; set; }
        public string LogsUrl { get; set; }
        public string CheckSuiteUrl { get; set; }
        public string CancelUrl { get; set; }
        public string RerunUrl { get; set; }
        public string ArtifactsUrl { get; set; }
        public string WorkflowUrl { get; set; }
        public string? PreviousAttemptUrl { get; set; }
        public string Display_Title { get; set; }
        public int HeadRepositoryId { get; set; }
        public Repository Repository { get; set; }

    }
    public class Repository
    {
        public string Name { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}
