using System.Diagnostics;
using System.Net.Http.Json;
using System.Text.Json;
namespace Client
{
    public class Http
    {
        public HttpClient _client;
        public Http(HttpClient client)
        {
            _client = client;
        }

        public async Task<T?> GetAsync<T>(string path) where T : class
        {
            Debug.Assert(!string.IsNullOrEmpty(path), nameof(path), $"{nameof(Http)}:{nameof(GetAsync)} - '{nameof(path)}' cannot be null or empty");


            var request = new HttpRequestMessage(HttpMethod.Get, path);
            Console.WriteLine(_client.BaseAddress);
            var response = await _client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {

                throw new HttpRequestException($"Request failed - Path: {path} Status: {response.StatusCode}");
            }

            return await response.Content.ReadFromJsonAsync<T>();

        }
    }
}
