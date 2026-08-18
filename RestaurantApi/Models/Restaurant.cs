namespace RestaurantApi.Models;

public class Restaurant
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int OwnerId { get; set; }

    public User? Owner { get; set; }

    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}