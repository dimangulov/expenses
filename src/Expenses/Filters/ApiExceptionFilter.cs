using System;
using System.Net;
using Expenses.Api.Common.Exceptions;
using Expenses.Api.Models.Errors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Expenses.Filters
{
    public class ApiExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is NotFoundException)
            {
                // handle explicit 'known' API errors
                var ex = context.Exception as NotFoundException;
                context.Exception = null;
                var apiError = new ApiError(ex.Message);

                context.Result = new JsonResult(apiError);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            else if (context.Exception is BadRequestException)
            {
                // handle explicit 'known' API errors
                var ex = context.Exception as BadRequestException;
                context.Exception = null;
                var apiError = new ApiError(ex.Message);

                context.Result = new JsonResult(apiError);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (context.Exception is UnauthorizedAccessException)
            {
                var apiError = new ApiError("Unauthorized Access");
                context.Result = new JsonResult(apiError);
                context.HttpContext.Response.StatusCode = 401;
            }

            base.OnException(context);
        }
    }
}