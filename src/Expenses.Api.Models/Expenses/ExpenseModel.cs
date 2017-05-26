using System;

namespace Expenses.Api.Models.Expenses
{
    public class ExpenseModel
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Comment { get; set; }

        public int UserId { get; set; }
        public string Username { get; set; }
    }
}