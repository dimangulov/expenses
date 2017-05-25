using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace Expenses.Queries.Tests.Helpers
{
    public class TestAsyncEnumerable<T> : System.Collections.Generic.IAsyncEnumerable<T>, IQueryable<T>, IAsyncEnumerableAccessor<T>
    {
        private IQueryable<T> _query;

        public TestAsyncEnumerable(IEnumerable<T> items)
        {
            _query = items.AsQueryable();
        }

        IEnumerator<T> IEnumerable<T>.GetEnumerator()
        {
            return _query.GetEnumerator();
        }

        public IAsyncEnumerator<T> GetEnumerator()
        {
            return (IAsyncEnumerator<T>) new TestAsyncEnumerable<T>.Enumerator(this._query);
        }

        private sealed class Enumerator : IAsyncEnumerator<T>, IDisposable
        {
            private readonly IEnumerator<T> _items;

            public T Current
            {
                get { return _items.Current; }
            }

            public Enumerator(IEnumerable<T> items)
            {
                _items = items.GetEnumerator();
            }

            public async Task<bool> MoveNext(CancellationToken cancellationToken)
            {
                cancellationToken.ThrowIfCancellationRequested();
                return _items.MoveNext();
            }

            void IDisposable.Dispose()
            {
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _query.GetEnumerator();
        }

        public Type ElementType { get { return typeof(T); } } 
        public Expression Expression { get { return _query.Expression; } }
        public IQueryProvider Provider { get { return _query.Provider; } }
        public IAsyncEnumerable<T> AsyncEnumerable { get { return this; } }
    }
}