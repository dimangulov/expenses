using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models.Login;
using Expenses.Api.Models.Users;
using Expenses.Data.Access.DAL;
using Expenses.Data.Access.Helpers;
using Expenses.Data.Model;
using Expenses.Queries.Queries;
using Expenses.Security;
using Expenses.Security.Auth;
using FluentAssertions;
using Moq;
using Xunit;

namespace Expenses.Queries.Tests
{
    public class LoginQueryProcessorTests
    {
        private Mock<IUnitOfWork> _uow;
        private List<User> _userList;
        private ILoginQueryProcessor _query;
        private Random _random;
        private List<Role> _roleList;
        private Mock<ITokenBuilder> _tokenBuilder;
        private Mock<IUsersQueryProcessor> _userQueryProcessor;
        private Mock<ISecurityContext> _context;

        public LoginQueryProcessorTests()
        {
            _random = new Random();
            _uow = new Mock<IUnitOfWork>();

            _userList = new List<User>();
            _uow.Setup(x => x.Query<User>()).Returns(() => _userList.AsQueryable());

            _tokenBuilder = new Mock<ITokenBuilder>(MockBehavior.Strict);
            _userQueryProcessor = new Mock<IUsersQueryProcessor>();

            _context = new Mock<ISecurityContext>(MockBehavior.Strict);

            _query = new LoginQueryProcessor(_uow.Object, _tokenBuilder.Object, _userQueryProcessor.Object, _context.Object);
        }

        [Fact]
        public void AuthenticateShouldReturnUserAndToken()
        {
            var password = _random.Next().ToString();
            var user = new User
            {
                Username = _random.Next().ToString(),
                Password = password.WithBCrypt(),
                Roles = new List<UserRole>
                {
                    new UserRole{Role = new Role {Name = _random.Next().ToString()}},
                    new UserRole{Role = new Role {Name = _random.Next().ToString()}},
                }
            };
            _userList.Add(user);

            var expireTokenDate = DateTime.Now + TokenAuthOption.ExpiresSpan;

            var token = _random.Next().ToString();
            _tokenBuilder.Setup(tb => tb.Build(
                user.Username, 
                It.Is<string[]>(roles => roles.SequenceEqual(user.Roles.Select(x => x.Role.Name).ToArray())),
                    It.Is<DateTime>(d => d - expireTokenDate < TimeSpan.FromSeconds(1))))
                .Returns(token);

            var result = _query.Authenticate(user.Username, password);

            result.User.Should().Be(user);
            result.Token.Should().Be(token);
            result.ExpiresAt.Should().BeCloseTo(expireTokenDate, 1000);
        }

        [Fact]
        public void AuthenticateShouldThrowIfUserPasswordIsWrong()
        {
            var password = _random.Next().ToString();
            var user = new User
            {
                Username = _random.Next().ToString(),
                Password = password.WithBCrypt(),
            };
            _userList.Add(user);

            Action execute = () => _query.Authenticate(user.Username, _random.Next().ToString());

            execute.Should().Throw<BadRequestException>();
        }

        [Fact]
        public void AuthenticateShouldThrowIfUserIsDeleted()
        {
            var password = _random.Next().ToString();
            var user = new User
            {
                Username = _random.Next().ToString(),
                Password = password.WithBCrypt(),
                IsDeleted = true
            };
            _userList.Add(user);

            Action execute = () => _query.Authenticate(user.Username, password);

            execute.Should().Throw<BadRequestException>();
        }

        [Fact]
        public async Task RegisterShouldCreateUserViaQuery()
        {
            var requestModel = new RegisterModel
            {
                Password = _random.Next().ToString(),
                Username = _random.Next().ToString(),
                LastName = _random.Next().ToString(),
                FirstName = _random.Next().ToString(),
            };

            var createdUser = new User();

            _userQueryProcessor.Setup(x => x.Create(It.Is<CreateUserModel>(m =>
                m.FirstName == requestModel.FirstName
                && m.LastName == requestModel.LastName
                && m.Password == requestModel.Password
                && m.Username == requestModel.Username
                && m.Roles.Length == 0
            ))).Returns(Task.FromResult(createdUser));

            var result = await _query.Register(requestModel);

            result.Should().Be(createdUser);
        }

        [Fact]
        public async Task ChangePasswordShouldCallUserQueryWithCurrentUser()
        {
            var user = new User { Id = _random.Next() };

            _context.SetupGet(x => x.User).Returns(user);

            var requestModel = new ChangeUserPasswordModel
            {
                Password = _random.Next().ToString()
            };

            _userQueryProcessor.Setup(x => x.ChangePassword(user.Id, requestModel))
                .Returns(Task.FromResult(0))
                .Verifiable();

            await _query.ChangePassword(requestModel);

            _userQueryProcessor.Verify();
        }
    }
}