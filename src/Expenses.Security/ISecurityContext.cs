using Expenses.Data.Model;

namespace Expenses.Security
{
    public interface ISecurityContext
    {
        User User { get; }

        bool IsAdministrator { get; }
    }
}