using System.Linq;
using AutoMapper;
using Expenses.Api.Models.Users;
using Expenses.Data.Model;

namespace Expenses.Maps
{
    public class UserMap : IAutoMapperTypeConfigurator
    {
        public void Configure(IMapperConfigurationExpression configuration)
        {
            var map = configuration.CreateMap<User, UserModel>();
            map.ForMember(x => x.Roles, x => x.MapFrom(u => u.Roles.Select(r => r.Role.Name).ToArray()));
        }
    }
}