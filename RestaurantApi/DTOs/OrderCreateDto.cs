using System.ComponentModel.DataAnnotations;

namespace RestaurantApi.DTOs;

public class OrderCreateDto
{
    [Required(ErrorMessage = "Le client est obligatoire.")]
    public int ClientId { get; set; }

    [Required(ErrorMessage = "Le restaurant est obligatoire.")]
    public int RestaurantId { get; set; }

    [Required(ErrorMessage = "L'adresse de livraison est obligatoire.")]
    [RegularExpression(
        @"^\d+\s+[\p{L}0-9\s,'-]+$",
        ErrorMessage = "L'adresse doit commencer par un numéro suivi du nom de la rue."
    )]
    public string DeliveryAddress { get; set; } = string.Empty;

    [Required(ErrorMessage = "La commande doit contenir au moins un plat.")]
    public List<OrderItemCreateDto> Items { get; set; } = new();
}