using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDishNameToOrderItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DishName",
                table: "OrderItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DishName",
                table: "OrderItems");
        }
    }
}
