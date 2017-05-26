using System.Linq;
using AutoMapper;
using Expenses.Api.Models.Users;
using Expenses.Data.Model;
using Expenses.Queries.Models;

namespace Expenses.Maps
{
    public class UserWithTokenMap : IAutoMapperTypeConfigurator
    {
        public void Configure(IMapperConfigurationExpression configuration)
        {
            var map = configuration.CreateMap<UserWithToken, UserWithTokenModel>();
        }
    }
}