using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Expenses.Data.Access.DAL
{
    public class EFUnitOfWork : IUnitOfWork
    {
        private DbContext _context;

        public EFUnitOfWork(DbContext context)
        {
            _context = context;
        }

        public DbContext Context => _context;

        public ITransaction BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.Snapshot)
        {
            return new DbTransaction(_context.Database.BeginTransaction(isolationLevel));
        }

        public void Add<T>(T obj)
            where T : class
        {
            var set = _context.Set<T>();
            set.Add(obj);
        }

        public void Update<T>(T obj)
            where T : class
        {
            var set = _context.Set<T>();
            set.Attach(obj);
            _context.Entry(obj).State = EntityState.Modified;
        }

        void IUnitOfWork.Remove<T>(T obj)
        {
            var set = _context.Set<T>();
            set.Remove(obj);
        }

        public IQueryable<T> Query<T>()
            where T : class
        {
            return _context.Set<T>();
        }

        public void Commit()
        {
            _context.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Attach<T>(T newUser) where T : class
        {
            var set = _context.Set<T>();
            set.Attach(newUser);
        }

        public void Dispose()
        {
            _context = null;
        }
    }
}