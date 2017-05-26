using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Models.Expenses;
using Expenses.Data.Model;

namespace Expenses.Queries.Queries
{
    public interface IExpensesQueryProcessor
    {
        IQueryable<Expense> Get();
        Expense Get(int id);
        Task<Expense> Create(CreateExpenseModel model);
        Task<Expense> Update(int id, UpdateExpenseModel model);
        Task Delete(int id);
    }
}