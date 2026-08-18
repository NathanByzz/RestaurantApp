using System.ComponentModel.DataAnnotations;

namespace RestaurantApi.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Le prénom est obligatoire.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est obligatoire.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est obligatoire.")]
    [EmailAddress(ErrorMessage = "Le format de l'email est invalide.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le numéro de téléphone est obligatoire.")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Le numéro de téléphone doit contenir exactement 10 chiffres.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le rôle est obligatoire.")]
    public string Role { get; set; } = string.Empty;
}