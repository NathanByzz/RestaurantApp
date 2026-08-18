namespace RestaurantApi.DTOs;

public class DishCreateDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public int RestaurantId { get; set; }

    public int CategoryId { get; set; }
}