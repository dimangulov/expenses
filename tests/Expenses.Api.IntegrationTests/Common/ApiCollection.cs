using Xunit;

namespace Expenses.Api.IntegrationTests.Common
{
    [CollectionDefinition("ApiCollection")]
    public class DbCollection : ICollectionFixture<ApiServer>
    {
    }
}