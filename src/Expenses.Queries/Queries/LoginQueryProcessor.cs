using System;
using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Models.Login;
using Expenses.Api.Models.Users;
using Expenses.Data.Access.DAL;
using Expenses.Data.Access.Helpers;
using Expenses.Data.Model;
using Expenses.Queries.Models;
using Expenses.Security.Auth;
using Microsoft.EntityFrameworkCore;

namespace Expenses.Queries.Queries
{
    public class LoginQueryProcessor : ILoginQueryProcessor
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenBuilder _tokenBuilder;
        private readonly IUsersQueryProcessor _usersQueryProcessor;

        public LoginQueryProcessor(IUnitOfWork uow, ITokenBuilder tokenBuilder, IUsersQueryProcessor usersQueryProcessor)
        {
            _uow = uow;
            _tokenBuilder = tokenBuilder;
            _usersQueryProcessor = usersQueryProcessor;
        }

        public UserWithToken Authenticate(string username, string password)
        {
            password = password.ToMD5();
            var user = (from u in _uow.Query<User>()
                    where u.Username == username && u.Password == password && !u.IsDeleted
                    select u)
                .Include(x => x.Roles)
                .ThenInclude(x => x.Role)
                .FirstOrDefault();

            if (user == null)
            {
                throw new UnauthorizedAccessException("username/password aren't right");
            }

            var expiresIn = DateTime.Now + TokenAuthOption.ExpiresSpan;
            var token = _tokenBuilder.Build(user.Username, user.Roles.Select(x => x.Role.Name).ToArray(), expiresIn);

            return new UserWithToken
            {
                ExpiresAt = expiresIn,
                Token = token,
                User = user
            };
        }

        public async Task<User> Register(RegisterModel model)
        {
            var requestModel = new CreateUserModel
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Password = model.Password,
                Username = model.Username
            };

            var user = await _usersQueryProcessor.Create(requestModel);
            return user;
        }
    }
}