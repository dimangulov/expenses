using System;
using System.Net.Http;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Expenses.Api.IntegrationTests.Helpers;
using Expenses.Api.Models.Expenses;
using FluentAssertions;
using Xunit;

namespace Expenses.Api.IntegrationTests.Expenses
{
    [Collection("ApiCollection")]
    public class PostShould
    {
        private readonly ApiServer _server;
        private readonly HttpClientWrapper _client;
        private Random _random;

        public PostShould(ApiServer server)
        {
            _server = server;
            _client = new HttpClientWrapper(_server.Client);
            _random = new Random();
        }

        [Fact]
        public async Task<ExpenseModel> CreateNew()
        {
            var requestItem = new CreateExpenseModel()
            {
                Amount = _random.Next(),
                Comment = _random.Next().ToString(),
                Date = DateTime.Now.AddMinutes(-15),
                Description = _random.Next().ToString()
            };

            var createdItem = await _client.PostAsync<ExpenseModel>("api/Expenses", requestItem);

            createdItem.Id.Should().BeGreaterThan(0);
            createdItem.Amount.Should().Be(requestItem.Amount);
            createdItem.Comment.Should().Be(requestItem.Comment);
            createdItem.Date.Should().Be(requestItem.Date);
            createdItem.Description.Should().Be(requestItem.Description);
            createdItem.Username.Should().Be("admin admin");

            return createdItem;
        }
    }
}