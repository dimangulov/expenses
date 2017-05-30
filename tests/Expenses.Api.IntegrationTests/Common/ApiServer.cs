using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Helpers;
using Expenses.Api.Models.Login;
using Expenses.Api.Models.Users;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Expenses.Api.IntegrationTests.Common
{
    public class ApiServer : IDisposable
    {
        public const string Username = "admin";
        public const string Password = "admin";

        private IConfigurationRoot _config;

        public ApiServer()
        {
            _config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            Server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            Client = GetAuthenticatedClient(Username, Password);
        }

        public HttpClient GetAuthenticatedClient(string username, string password)
        {
            var client = Server.CreateClient();
            var response = client.PostAsync("/api/Login/Authenticate",
                new JsonContent(new LoginModel {Password = password, Username = username})).Result;

            response.EnsureSuccessStatusCode();

            var data = JsonConvert.DeserializeObject<UserWithTokenModel>(response.Content.ReadAsStringAsync().Result);
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + data.Token);
            return client;
        }

        public HttpClient Client { get; private set; }

        public TestServer Server { get; private set; }

        public void Dispose()
        {
            if (Client != null)
            {
                Client.Dispose();
                Client = null;
            }

            if (Server != null)
            {
                Server.Dispose();
                Server = null;
            }
        }
    }
}