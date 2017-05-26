using System;
using System.ComponentModel.DataAnnotations;

namespace Expenses.Api.Models.Expenses
{
    public class CreateExpenseModel
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Comment { get; set; }
    }
}