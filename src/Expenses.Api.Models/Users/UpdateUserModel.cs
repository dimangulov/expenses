using System.ComponentModel.DataAnnotations;

namespace Expenses.Api.Models.Users
{
    public class UpdateUserModel
    {
        public UpdateUserModel()
        {
            Roles = new string[0];
        }

        [Required]
        public string Username { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string[] Roles { get; set; }
    }
}