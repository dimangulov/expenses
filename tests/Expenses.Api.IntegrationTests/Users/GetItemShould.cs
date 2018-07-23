using System;
using System.Net;
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
    public class GetItemShould
    {
        private readonly ApiServer _server;
        private readonly HttpClient _client;
        private Random _random;

        public GetItemShould(ApiServer server)
        {
            _server = server;
            _client = _server.Client;
            _random = new Random();
        }

        [Fact]
        public async Task ReturnItemById()
        {
            var item = await new Login.PostShould(_server).RegisterNewUser();

            var result = await GetById(_client, item.Id);

            result.Should().NotBeNull();
        }

        public static async Task<UserModel> GetById(HttpClient client, int id)
        {
            var response = await client.GetAsync(new Uri($"api/Users/{id}", UriKind.Relative));
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UserModel>(result);
        }

        [Fact]
        public async Task ShouldReturn404StatusIfNotFound()
        {
            var response = await _client.GetAsync(new Uri($"api/Users/-1", UriKind.Relative));
            
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}