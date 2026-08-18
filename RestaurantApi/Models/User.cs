namespace RestaurantApi.Models;

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Client";

    public ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}