using System;
using System.Net.Http;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Xunit;

namespace Expenses.Api.IntegrationTests.Users
{
    [Collection("ApiCollection")]
    public class DeleteShould
    {
        private readonly ApiServer _server;
        private readonly HttpClient _client;

        public DeleteShould(ApiServer server)
        {
            _server = server;
            _client = server.Client;
        }

        [Fact]
        public async Task DeleteExistingItem()
        {
            var item = await new Login.PostShould(_server).RegisterNewUser();

            var response = await _client.DeleteAsync(new Uri($"api/Users/{item.Id}", UriKind.Relative));
            response.EnsureSuccessStatusCode();
        }
    }
}