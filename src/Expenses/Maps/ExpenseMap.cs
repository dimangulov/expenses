using System.Linq;
using AutoMapper;
using Expenses.Api.Models.Expenses;
using Expenses.Api.Models.Users;
using Expenses.Data.Model;

namespace Expenses.Maps
{
    public class ExpenseMap : IAutoMapperTypeConfigurator
    {
        public void Configure(IMapperConfigurationExpression configuration)
        {
            var map = configuration.CreateMap<Expense, ExpenseModel>();
            map.ForMember(x => x.Username, x => x.MapFrom(y => y.User.FirstName + " " + y.User.LastName));
        }
    }
}