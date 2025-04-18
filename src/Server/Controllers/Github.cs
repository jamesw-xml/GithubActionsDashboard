using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;
using System.Text.Json;
using Shared;

namespace Server.Controllers
{
    [ApiController]
    public class Github : ControllerBase
    {
        private readonly ILogger<Github> _logger;
        private readonly Http _client;
        public Github(Http client, ILogger<Github> logger)
        {
            _client = client;
            _logger = logger;
        }

        [HttpGet("api/github")]
        public async Task<IList<WorkflowRun>> Get()
        {
            return await _client.Get();
        }
    }
}
