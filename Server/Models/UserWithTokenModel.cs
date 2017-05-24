namespace Expenses.Server.Models
{
  public class UserWithTokenModel
  {
      public string Token { get; set; }
      public User User { get; set; }
  }
}
