using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models.Users;
using Expenses.Data.Access.DAL;
using Expenses.Data.Access.Helpers;
using Expenses.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace Expenses.Queries.Queries
{
    public class UsersQueryProcessor : IUsersQueryProcessor
    {
        private readonly IUnitOfWork _uow;

        public UsersQueryProcessor(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public User[] Get(int pageNo, int pageSize)
        {
            if (pageNo < 1)
            {
                throw new BadRequestException("Page number should be greater or equal 1");
            }

            if (pageSize < 1)
            {
                throw new BadRequestException("Page size should be greater or equal 1");
            }

            if (pageSize > 100)
            {
                throw new BadRequestException("Page size should be less or equal 100");
            }

            var users = GetQuery()
                .Where(x => !x.IsDeleted)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArray();

            return users;
        }

        private IQueryable<User> GetQuery()
        {
            return _uow.Query<User>()
                .Include(x => x.Roles)
                    .ThenInclude(x => x.Role);
        }

        public User Get(int id)
        {
            var user = GetQuery().FirstOrDefault(x => x.Id == id);

            if (user == null || user.IsDeleted)
            {
                throw new NotFoundException("User is not found");
            }

            return user;
        }

        public async Task<User> Create(CreateUserModel model)
        {
            var username = model.Username.Trim();

            if (GetQuery().Any(u => u.Username == username))
            {
                throw new BadRequestException("The username is already in use");
            }

            var user = new User
            {
                Username = model.Username.Trim(),
                Password = model.Password.Trim().ToMD5(),
                FirstName = model.FirstName.Trim(),
                LastName = model.LastName.Trim(),
            };

            AddUserRoles(user, model.Roles);

            _uow.Add(user);
            await _uow.CommitAsync();

            return user;
        }

        private void AddUserRoles(User user, string[] roleNames)
        {
            user.Roles.Clear();

            foreach (var roleName in roleNames)
            {
                var role = _uow.Query<Role>().FirstOrDefault(x => x.Name == roleName);

                if (role == null)
                {
                    throw new NotFoundException($"Role - {roleName} is not found");
                }

                user.Roles.Add(new UserRole{User = user, Role = role});
            }
        }

        public async Task<User> Update(int id, UpdateUserModel model)
        {
            var user = GetQuery().FirstOrDefault(x => x.Id == id);

            if (user == null)
            {
                throw new NotFoundException("User is not found");
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            AddUserRoles(user, model.Roles);

            await _uow.CommitAsync();
            return user;
        }

        public async Task Delete(int id)
        {
            var user = GetQuery().FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("User is not found");
            }

            if (user.IsDeleted) return;

            user.IsDeleted = true;
            await _uow.CommitAsync();
        }
    }
}