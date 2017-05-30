using System;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Expenses.Api.IntegrationTests.Helpers;
using Expenses.Api.Models.Login;
using Expenses.Api.Models.Users;
using FluentAssertions;
using Xunit;

namespace Expenses.Api.IntegrationTests.Users
{
    [Collection("ApiCollection")]
    public class PostShould
    {
        private readonly ApiServer _server;
        private readonly HttpClientWrapper _client;
        private Random _random;

        public PostShould(ApiServer server)
        {
            _random = new Random();
            _server = server;
            _client = new HttpClientWrapper(_server.Client);
        }

        [Fact]
        public async Task ChangePassword()
        {
            var newUser = await new Login.PostShould(_server).RegisterNewUser();
            var newPassword = _random.Next().ToString();
            await _client.PostAsync($"api/Users/{newUser.Id}/password", new ChangeUserPasswordModel
            {
                Password = newPassword
            });

            //Should be able to login
            var loginedUser = await new Login.PostShould(_server).Autheticate(newUser.Username, newPassword);
            loginedUser.User.Username.Should().Be(newUser.Username);
        }
    }
}