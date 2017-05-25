using Expenses.Data.Access.DAL;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Expenses.Data.Access.Migrations
{
    [DbContext(typeof(MainDbContext))]
    [Migration("CustomMigration_001_SeedRoles")]
    public class SeedRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
  INSERT INTO dbo.Roles
          ( Name )
  VALUES  ( N'Administrator'  -- Name - nvarchar(max)
            )

			
  INSERT INTO dbo.Roles
          ( Name )
  VALUES  ( N'Manager'  -- Name - nvarchar(max)
            )
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
  delete from  dbo.Roles
");
        }
    }
}