using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Expenses.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
