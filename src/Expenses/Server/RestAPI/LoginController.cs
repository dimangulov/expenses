using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models;
using Expenses.Api.Models.Login;
using Expenses.Api.Models.Users;
using Expenses.Auth;
using Expenses.Data.Access.DAL;
using Expenses.Data.Access.Helpers;
using Expenses.Data.Model;
using Expenses.Filters;
using Expenses.Maps;
using Expenses.Queries;
using Expenses.Queries.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Expenses.Server.RestAPI
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IAutoMapper _mapper;
        private readonly IUsersQueryProcessor _usersQueryProcessor;

        public LoginController(IUnitOfWork uow, IAutoMapper mapper, IUsersQueryProcessor usersQueryProcessor)
        {
            _uow = uow;
            _mapper = mapper;
            _usersQueryProcessor = usersQueryProcessor;
        }

        [HttpPost("Authenticate")]
        [ValidateModel]
        public UserWithTokenModel Authenticate([FromBody]LoginModel model)
        {
            var username = model.Username;
            var password = model.Password.ToMD5();
            var user = (from u in _uow.Query<User>()
                where u.Username == username && u.Password == password
                select u)
                .Include(x => x.Roles)
                    .ThenInclude(x => x.Role)
                .FirstOrDefault();

            if (user == null)
            {
                throw new NotFoundException("User is not found");
            }

            var userModel = _mapper.Map<UserModel>(user);

            var requestAt = DateTime.Now;
            var expiresIn = requestAt + TokenAuthOption.ExpiresSpan;
            var token = GenerateToken(userModel, expiresIn);

            return new UserWithTokenModel
            {
                RequestedAt = requestAt,
                ExpiresAt = expiresIn,
                TokenType = TokenAuthOption.TokenType,
                Token = token,
                User = userModel
            };
        }

        private string GenerateToken(UserModel user, DateTime expires)
        {
            var handler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            foreach (var userRole in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            ClaimsIdentity identity = new ClaimsIdentity(
                new GenericIdentity(user.Username, "Bearer"),
                claims
            );

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = TokenAuthOption.Issuer,
                Audience = TokenAuthOption.Audience,
                SigningCredentials = TokenAuthOption.SigningCredentials,
                Subject = identity,
                Expires = expires
            });

            return handler.WriteToken(securityToken);
        }

        [HttpPost("Register")]
        [ValidateModel]
        public async Task<UserModel> Register([FromBody]RegisterModel model)
        {
            var requestModel = new CreateUserModel
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Password = model.Password,
                Username = model.Username
            };

            var user = await _usersQueryProcessor.Create(requestModel);
            var resultModel = _mapper.Map<UserModel>(user);
            return resultModel;
        }
    }
}
