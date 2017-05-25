namespace Expenses.Api.Models.Errors
{
    public class ApiError
    {
        public string Message { get; }

        public ApiError(string message)
        {
            Message = message;
        }
    }
}