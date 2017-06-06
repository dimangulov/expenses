using System;
using System.Net.Http;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Expenses.Api.IntegrationTests.Helpers;
using Expenses.Api.Models.Users;
using Expenses.Data.Access.Constants;
using FluentAssertions;
using Xunit;

namespace Expenses.Api.IntegrationTests.Users
{
    [Collection("ApiCollection")]
    public class PutShould
    {
        private readonly ApiServer _server;
        private readonly HttpClientWrapper _client;
        private Random _random;

        public PutShould(ApiServer server)
        {
            _server = server;
            _client = new HttpClientWrapper(_server.Client);
            _random = new Random();
        }

        [Fact]
        public async Task UpdateExistingItem()
        {
            var item = await new Login.PostShould(_server).RegisterNewUser();

            var requestItem = new UpdateUserModel
            {
                Username = "TU_Update_" + _random.Next(),
                FirstName = _random.Next().ToString(),
                LastName = _random.Next().ToString(),
                Roles = new[] {Roles.Manager}
            };

            await _client.PutAsync<UserModel>($"api/Users/{item.Id}", requestItem);

            var updatedUser = await GetItemShould.GetById(_client.Client, item.Id);

            updatedUser.FirstName.Should().Be(requestItem.FirstName);
            updatedUser.LastName.Should().Be(requestItem.LastName);

            updatedUser.Roles.Should().HaveCount(1);
            updatedUser.Roles.Should().Contain(Roles.Manager);
        }
    }
}