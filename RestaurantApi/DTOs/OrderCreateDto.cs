namespace RestaurantApi.DTOs;

public class OrderCreateDto
{
    public int ClientId { get; set; }

    public int RestaurantId { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;

    public List<OrderItemCreateDto> Items { get; set; } = new();
}