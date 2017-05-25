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
        private IConfigurationRoot _config;

        public ApiServer()
        {
            _config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            Server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            Client = Server.CreateClient();
            
            Authenticate("admin", "admin");
        }

        private void Authenticate(string username, string password)
        {
            var response = Client.PostAsync("/api/Login/Authenticate",
                new JsonContent(new LoginModel {Password = password, Username = username})).Result;

            response.EnsureSuccessStatusCode();

            var data = JsonConvert.DeserializeObject<UserWithTokenModel>(response.Content.ReadAsStringAsync().Result);
            Client.DefaultRequestHeaders.Add("Authorization", "Bearer " + data.Token);
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