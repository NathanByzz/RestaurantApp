namespace RestaurantApi.Models;

public class Order
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Pending";

    public decimal TotalAmount { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;

    public int ClientId { get; set; }

    public User? Client { get; set; }

    public int RestaurantId { get; set; }

    public Restaurant? Restaurant { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}