using System;

namespace Expenses.Data.Access.DAL
{
    public interface ITransaction : IDisposable
    {
        void Commit();
        void Rollback();
    }
}