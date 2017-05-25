using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Expenses.Data.Access.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        ITransaction BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.Snapshot);

        void Add<T>(T obj) where T: class ;
        void Update<T>(T obj) where T : class;
        void Remove<T>(T obj) where T : class;
        IQueryable<T> Query<T>() where T : class;
        void Commit();
        Task CommitAsync();
        void Attach<T>(T obj) where T : class;
    }
}