using Microsoft.AspNetCore.Mvc.Filters;

namespace Expenses.Helpers
{
    public interface IActionTransactionHelper
    {
        void BeginTransaction();
        void EndTransaction(ActionExecutedContext filterContext);
        void CloseSession();
    }
}