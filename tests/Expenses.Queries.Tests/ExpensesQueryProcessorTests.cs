using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models.Expenses;
using Expenses.Data.Access.DAL;
using Expenses.Data.Model;
using Expenses.Queries.Queries;
using Expenses.Security;
using FluentAssertions;
using Moq;
using Xunit;

namespace Expenses.Queries.Tests
{
    public class ExpensesQueryProcessorTests
    {
        private Mock<IUnitOfWork> _uow;
        private List<Expense> _expenseList;
        private IExpensesQueryProcessor _query;
        private Random _random;
        private User _currentUser;
        private Mock<ISecurityContext> _securityContext;

        public ExpensesQueryProcessorTests()
        {
            _random = new Random();
            _uow = new Mock<IUnitOfWork>();

            _expenseList = new List<Expense>();
            _uow.Setup(x => x.Query<Expense>()).Returns(() => _expenseList.AsQueryable());

            _currentUser = new User{Id = _random.Next()};
            _securityContext = new Mock<ISecurityContext>(MockBehavior.Strict);
            _securityContext.Setup(x => x.User).Returns(_currentUser);
            _securityContext.Setup(x => x.IsAdministrator).Returns(false);

            _query = new ExpensesQueryProcessor(_uow.Object, _securityContext.Object);
        }

        [Fact]
        public void GetShouldReturnAll()
        {
            _expenseList.Add(new Expense{UserId = _currentUser.Id});

            var result = _query.Get().ToList();
            result.Count.Should().Be(1);
        }

        [Fact]
        public void GetShouldReturnOnlyUserExpenses()
        {
            _expenseList.Add(new Expense { UserId = _random.Next() });
            _expenseList.Add(new Expense { UserId = _currentUser.Id });

            var result = _query.Get().ToList();
            result.Count().Should().Be(1);
            result[0].UserId.Should().Be(_currentUser.Id);
        }

        [Fact]
        public void GetShouldReturnAllExpensesForAdministrator()
        {
            _securityContext.Setup(x => x.IsAdministrator).Returns(true);

            _expenseList.Add(new Expense { UserId = _random.Next() });
            _expenseList.Add(new Expense { UserId = _currentUser.Id });

            var result = _query.Get();
            result.Count().Should().Be(2);
        }

        [Fact]
        public void GetShouldReturnAllExceptDeleted()
        {
            _expenseList.Add(new Expense { UserId = _currentUser.Id });
            _expenseList.Add(new Expense { UserId = _currentUser.Id, IsDeleted = true});

            var result = _query.Get();
            result.Count().Should().Be(1);
        }

        [Fact]
        public void GetShouldReturnById()
        {
            var expense = new Expense { Id = _random.Next(), UserId = _currentUser.Id };
            _expenseList.Add(expense);

            var result = _query.Get(expense.Id);
            result.Should().Be(expense);
        }

        [Fact]
        public void GetShouldThrowExceptionIfExpenseOfOtherUser()
        {
            var expense = new Expense { Id = _random.Next(), UserId = _random.Next() };
            _expenseList.Add(expense);

            Action get = () =>
            {
                _query.Get(expense.Id);
            };

            get.Should().Throw<NotFoundException>();
        }

        [Fact]
        public void GetShouldThrowExceptionIfItemIsNotFoundById()
        {
            var expense = new Expense { Id = _random.Next(), UserId = _currentUser.Id };
            _expenseList.Add(expense);

            Action get = () =>
            {
                _query.Get(_random.Next());
            };

            get.Should().Throw<NotFoundException>();
        }

        [Fact]
        public void GetShouldThrowExceptionIfUserIsDeleted()
        {
            var expense = new Expense { Id = _random.Next(), UserId = _currentUser.Id, IsDeleted = true};
            _expenseList.Add(expense);

            Action get = () =>
            {
                _query.Get(expense.Id);
            };

            get.Should().Throw<NotFoundException>();
        }

        [Fact]
        public async Task CreateShouldSaveNew()
        {
            var model = new CreateExpenseModel
            {
                Description = _random.Next().ToString(),
                Amount = _random.Next(),
                Comment = _random.Next().ToString(),
                Date = DateTime.Now
            };

            var result = await _query.Create(model);

            result.Description.Should().Be(model.Description);
            result.Amount.Should().Be(model.Amount);
            result.Comment.Should().Be(model.Comment);
            result.Date.Should().BeCloseTo(model.Date);
            result.UserId.Should().Be(_currentUser.Id);

            _uow.Verify(x => x.Add(result));
            _uow.Verify(x => x.CommitAsync());
        }

        [Fact]
        public async Task UpdateShouldUpdateFields()
        {
            var user = new Expense {Id = _random.Next(), UserId = _currentUser.Id};
            _expenseList.Add(user);

            var model = new UpdateExpenseModel
            {
                Comment = _random.Next().ToString(),
                Description = _random.Next().ToString(),
                Amount = _random.Next(),
                Date = DateTime.Now
            };

            var result = await _query.Update(user.Id, model);

            result.Should().Be(user);
            result.Description.Should().Be(model.Description);
            result.Amount.Should().Be(model.Amount);
            result.Comment.Should().Be(model.Comment);
            result.Date.Should().BeCloseTo(model.Date);

            _uow.Verify(x => x.CommitAsync());
        }
        
        [Fact]
        public void UpdateShoudlThrowExceptionIfItemIsNotFound()
        {
            Action create = () =>
            {
                var result = _query.Update(_random.Next(), new UpdateExpenseModel()).Result;
            };

            create.Should().Throw<NotFoundException>();
        }

        [Fact]
        public async Task DeleteShouldMarkAsDeleted()
        {
            var user = new Expense() { Id = _random.Next(), UserId = _currentUser.Id};
            _expenseList.Add(user);

            await _query.Delete(user.Id);

            user.IsDeleted.Should().BeTrue();

            _uow.Verify(x => x.CommitAsync());
        }

        [Fact]
        public async Task DeleteShoudlThrowExceptionIfItemIsNotBelongTheUser()
        {
            var expense = new Expense() { Id = _random.Next(), UserId = _random.Next() };
            _expenseList.Add(expense);

            Action execute = () =>
            {
                _query.Delete(expense.Id).Wait();
            };

            execute.Should().Throw<NotFoundException>();
        }

        [Fact]
        public void DeleteShoudlThrowExceptionIfItemIsNotFound()
        {
            Action execute = () =>
            {
                _query.Delete(_random.Next()).Wait();
            };

            execute.Should().Throw<NotFoundException>();
        }
    }
}