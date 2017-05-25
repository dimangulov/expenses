using Microsoft.EntityFrameworkCore;

namespace Expenses.Data.Access.Maps.Common
{
    public interface IMap
    {
        void Visit(ModelBuilder builder);
    }
}