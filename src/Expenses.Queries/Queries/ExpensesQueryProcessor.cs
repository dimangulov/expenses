using System;
using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models.Expenses;
using Expenses.Api.Models.Users;
using Expenses.Data.Access.DAL;
using Expenses.Data.Model;
using Expenses.Security;
using Microsoft.EntityFrameworkCore;

namespace Expenses.Queries.Queries
{
    public class ExpensesQueryProcessor : IExpensesQueryProcessor
    {
        private readonly IUnitOfWork _uow;
        private readonly ISecurityContext _securityContext;

        public ExpensesQueryProcessor(IUnitOfWork uow, ISecurityContext securityContext)
        {
            _uow = uow;
            _securityContext = securityContext;
        }

        public Expense[] Get(int pageNo, int pageSize, DateTime? fromDate, DateTime? toDate)
        {
            if (pageNo < 1)
            {
                throw new BadRequestException("Page number should be greater or equal 1");
            }

            if (pageSize < 1)
            {
                throw new BadRequestException("Page size should be greater or equal 1");
            }

            if (pageSize > 100)
            {
                throw new BadRequestException("Page size should be less or equal 100");
            }

            var users = GetQuery()
                .Where(x => !x.IsDeleted)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArray();

            return users;
        }

        private IQueryable<Expense> GetQuery()
        {
            var q = _uow.Query<Expense>()
                .Where(x => !x.IsDeleted);

            var userId = _securityContext.User.Id;
            q = q.Where(x => x.UserId == userId);

            return q;
        }

        public Expense Get(int id)
        {
            var user = GetQuery().FirstOrDefault(x => x.Id == id);

            if (user == null)
            {
                throw new NotFoundException("Expense is not found");
            }

            return user;
        }

        public async Task<Expense> Create(CreateExpenseModel model)
        {
            var item = new Expense
            {
                UserId = _securityContext.User.Id,
                Amount = model.Amount,
                Comment = model.Comment,
                Date = model.Date,
                Description = model.Description,
            };

            _uow.Add(item);
            await _uow.CommitAsync();

            return item;
        }

        public async Task<Expense> Update(int id, UpdateExpenseModel model)
        {
            var expense = GetQuery().FirstOrDefault(x => x.Id == id);

            if (expense == null)
            {
                throw new NotFoundException("Expense is not found");
            }

            expense.Amount = model.Amount;
            expense.Comment = model.Comment;
            expense.Description = model.Description;
            expense.Date = model.Date;

            await _uow.CommitAsync();
            return expense;
        }

        public async Task Delete(int id)
        {
            var user = GetQuery().FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("Expense is not found");
            }

            if (user.IsDeleted) return;

            user.IsDeleted = true;
            await _uow.CommitAsync();
        }
    }
}