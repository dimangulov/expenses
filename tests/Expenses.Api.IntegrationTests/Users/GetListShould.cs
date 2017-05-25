using System.Net.Http;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Expenses.Api.Models.Users;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Expenses.Api.IntegrationTests.Users
{
    [Collection("ApiCollection")]
    public class GetListShould
    {
        private readonly ApiServer _server;
        private readonly HttpClient _client;

        public GetListShould(ApiServer server)
        {
            _server = server;
            _client = server.Client;
        }

        public static async Task<UserModel[]> Get(HttpClient client, int pageNo = 1, int pageSize = 20)
        {
            var response = await client.GetAsync($"api/Users?pageNo={pageNo}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            var responseText = await response.Content.ReadAsStringAsync();
            var items = JsonConvert.DeserializeObject<UserModel[]>(responseText);
            return items;
        }

        [Fact]
        public async Task ReturnAnyList()
        {
            var items = await Get(_client);
            items.Should().NotBeNull();
        }
    }
}