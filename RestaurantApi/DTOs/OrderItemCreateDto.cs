namespace RestaurantApi.DTOs;

public class OrderItemCreateDto
{
    public int DishId { get; set; }

    public int Quantity { get; set; }
}