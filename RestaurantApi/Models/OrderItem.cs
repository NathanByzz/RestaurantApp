namespace RestaurantApi.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int DishId { get; set; }

    public string DishName { get; set; } = string.Empty;

    public Dish? Dish { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }
}