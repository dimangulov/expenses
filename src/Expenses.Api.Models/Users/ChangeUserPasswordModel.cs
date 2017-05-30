using System.ComponentModel.DataAnnotations;

namespace Expenses.Api.Models.Users
{
    public class ChangeUserPasswordModel
    {
        [Required]
        public string Password { get; set; }
    }
}