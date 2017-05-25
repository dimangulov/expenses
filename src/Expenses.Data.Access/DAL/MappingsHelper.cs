using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Expenses.Data.Access.Maps.Common;
using Expenses.Data.Access.Maps.Main;

namespace Expenses.Data.Access.DAL
{
    public static class MappingsHelper
    {
        public static IEnumerable<IMap> GetMainMappings()
        {
            var assemblyTypes = typeof(UserMap).GetTypeInfo().Assembly.DefinedTypes;
            var mappings = assemblyTypes
                // ReSharper disable once AssignNullToNotNullAttribute
                .Where(t => t.Namespace != null && t.Namespace.Contains(typeof(UserMap).Namespace))
                .Where(t => typeof(IMap).GetTypeInfo().IsAssignableFrom(t));
            mappings = mappings.Where(x => !x.IsAbstract);
            return mappings.Select(m => (IMap) Activator.CreateInstance(m.AsType())).ToArray();
        }
    }
}