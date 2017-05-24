using System;
using Expenses.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Expenses.Server.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        [HttpPost("Authenticate")]
        public UserWithTokenModel Authenticate([FromBody]LoginModel model)
        {
            return new UserWithTokenModel
            {
                Token = $"{model.Username} - {model.Password}",
                User = new User
                {
                    Id = 1,
                    Password = "1",
                    Username = "dimangulov",
                    FirstName = "Damir",
                    LastName = "Imangulov"
                }
            };
        }
    }
}
