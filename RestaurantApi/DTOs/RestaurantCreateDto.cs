using System.ComponentModel.DataAnnotations;

namespace RestaurantApi.DTOs;

public class RestaurantCreateDto
{
    [Required(ErrorMessage = "Le nom du restaurant est obligatoire.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La description du restaurant est obligatoire.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'adresse du restaurant est obligatoire.")]
    [RegularExpression(@"^\d+\s+[\p{L}0-9\s,'-]+$", ErrorMessage = "L'adresse doit commencer par un numéro suivi du nom de la rue.")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le numéro de téléphone est obligatoire.")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Le numéro de téléphone doit contenir exactement 10 chiffres.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le propriétaire est obligatoire.")]
    public int OwnerId { get; set; }
}