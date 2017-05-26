using System;
using System.Threading.Tasks;
using Expenses.Api.IntegrationTests.Common;
using Expenses.Api.IntegrationTests.Helpers;
using Expenses.Api.Models.Expenses;
using FluentAssertions;
using Xunit;

namespace Expenses.Api.IntegrationTests.Expenses
{
    [Collection("ApiCollection")]
    public class PutShould
    {
        private readonly ApiServer _server;
        private readonly HttpClientWrapper _client;
        private readonly Random _random;

        public PutShould(ApiServer server)
        {
            _server = server;
            _client = new HttpClientWrapper(_server.Client);
            _random = new Random();
        }

        [Fact]
        public async Task UpdateExistingItem()
        {
            var item = await new PostShould(_server).CreateNew();

            var requestItem = new UpdateExpenseModel
            {
                Date = DateTime.Now,
                Description = _random.Next().ToString(),
                Amount = _random.Next(),
                Comment = _random.Next().ToString()
            };

            await _client.PutAsync<ExpenseModel>($"api/Expenses/{item.Id}", requestItem);

            var updatedItem = await GetItemShould.GetById(_client.Client, item.Id);

            updatedItem.Date.Should().Be(requestItem.Date);
            updatedItem.Description.Should().Be(requestItem.Description);

            updatedItem.Amount.Should().Be(requestItem.Amount);
            updatedItem.Comment.Should().Contain(requestItem.Comment);
        }
    }
}