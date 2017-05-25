using AutoMapper;

namespace Expenses.Maps
{
    public interface IAutoMapperTypeConfigurator
    {
        void Configure(IMapperConfigurationExpression configuration);
    }
}