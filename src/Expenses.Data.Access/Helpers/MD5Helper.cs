using System;
using System.Security.Cryptography;
using System.Text;

namespace Expenses.Data.Access.Helpers
{
    public static class MD5Helper
    {
        public static string ToMD5(this string text)
        {
            var bytes = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(text));
            var result = Convert.ToBase64String(bytes);
            return result;
        }
    }
}