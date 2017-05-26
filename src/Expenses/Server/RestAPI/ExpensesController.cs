using System;
using System.Threading.Tasks;
using Expenses.Api.Models.Expenses;
using Expenses.Api.Models.Users;
using Expenses.Data.Model;
using Expenses.Filters;
using Expenses.Maps;
using Expenses.Queries.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Expenses.Server.RestAPI
{
    [Route("api/[controller]")]
    public class ExpensesController : Controller
    {
        private readonly IExpensesQueryProcessor _query;
        private readonly IAutoMapper _mapper;

        public ExpensesController(IExpensesQueryProcessor query, IAutoMapper mapper)
        {
            _query = query;
            _mapper = mapper;
        }

        [HttpGet]
        public ExpenseModel[] Get(int pageNo = 1, int pageSize = 20, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var items = _query.Get(pageNo, pageSize, fromDate, toDate);
            var models = _mapper.Map<Expense, ExpenseModel>(items);
            return models;
        }

        [HttpGet("{id}")]
        public ExpenseModel Get(int id)
        {
            var item = _query.Get(id);
            var model = _mapper.Map<ExpenseModel>(item);
            return model;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ExpenseModel> Post([FromBody]CreateExpenseModel requestModel)
        {
            var item = await _query.Create(requestModel);
            var model = _mapper.Map<ExpenseModel>(item);
            return model;
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<ExpenseModel> Put(int id, [FromBody]UpdateExpenseModel requestModel)
        {
            var item = await _query.Update(id, requestModel);
            var model = _mapper.Map<ExpenseModel>(item);
            return model;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _query.Delete(id);
        }
    }
}