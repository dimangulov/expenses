using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Expenses.Maps
{
    public class AutoMapperAdapter : IAutoMapper
    {
        private readonly IMapper _mapper;

        public AutoMapperAdapter(IMapper mapper)
        {
            _mapper = mapper;
        }

        public IConfigurationProvider Configuration => _mapper.ConfigurationProvider;

        public T Map<T>(object objectToMap)
        {
            return _mapper.Map<T>(objectToMap);
        }

        public TResult[] Map<TSource, TResult>(IEnumerable<TSource> sourceQuery)
        {
            return sourceQuery.Select(x => _mapper.Map<TResult>(x)).ToArray();
        }

        public IQueryable<TResult> Map<TSource, TResult>(IQueryable<TSource> sourceQuery)
        {
            return sourceQuery.ProjectTo<TResult>(_mapper.ConfigurationProvider);
        }

        public void Map<TSource, TDestination>(TSource source, TDestination destination)
        {
            _mapper.Map(source, destination);
        }
    }
}