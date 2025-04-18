using Microsoft.Net.Http.Headers;
using Shared;
using static System.Net.WebRequestMethods;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var settings = builder.Configuration.Get<Settings>()!;
            builder.Services.AddHttpClient("GithubClient", client =>
            {
                client.BaseAddress = new Uri("https://api.github.com/");
                client.DefaultRequestHeaders.UserAgent.ParseAdd("GitHubActionsDashboardServer");
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", settings.GithubToken);
            });
            builder.Services.AddSingleton<Settings>(settings);
            builder.Services.AddScoped<Http>(sp =>
            {
                var clientFactory = sp.GetRequiredService<IHttpClientFactory>();
                var client = clientFactory.CreateClient("GithubClient");
                return new Http(client, sp.GetRequiredService<Settings>());
            }); builder.Services.AddControllersWithViews();
            builder.Services.AddRazorPages();
            builder.Services.AddRazorComponents()
                .AddInteractiveWebAssemblyComponents();

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseWebAssemblyDebugging();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseBlazorFrameworkFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    //const int durationInSeconds = 60 * 60 * 24;
                    //ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                    //    "public,max-age=" + durationInSeconds;
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                        "no-cache,max-age=0";
                }
            });

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseAntiforgery();

            app.MapRazorPages();
            app.MapControllers();

            // Default fallback for other routes
            app.MapFallbackToFile("index.html");

            app.UseHttpsRedirection();

            app.Run();
        }
        }
}
