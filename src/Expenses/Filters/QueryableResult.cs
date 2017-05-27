using System;
using AutoQueryable.Extensions;
using AutoQueryable.Helpers;
using AutoQueryable.Models;
using Expenses.Api.Models.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Expenses.Filters
{
    public class QueryableResult : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null) return;

            dynamic query = ((ObjectResult)context.Result).Value;
            if (query == null) throw new Exception("Unable to retreive value of IQueryable from context result.");
            Type entityType = query.GetType().GenericTypeArguments[0];

            //string queryString = context.HttpContext.Request.QueryString.HasValue ? context.HttpContext.Request.QueryString.Value : null;

            if (!context.HttpContext.Request.Query.ContainsKey("commands")) return;
            var commands = context.HttpContext.Request.Query["commands"];
            if (string.IsNullOrWhiteSpace(commands)) return;

            var data = QueryableHelper.GetAutoQuery(commands, entityType, query,
                new AutoQueryableProfile {UnselectableProperties = new string[0]});
            var total = System.Linq.Queryable.Count(query);
            context.Result = new OkObjectResult(new DataResult{Data = data, Total = total});
        }
    }
}