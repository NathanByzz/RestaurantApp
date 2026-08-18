using System.ComponentModel.DataAnnotations;

namespace RestaurantApi.DTOs;

public class UpdatePhoneNumberDto
{
    [Required(ErrorMessage = "Le numéro de téléphone est obligatoire.")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Le numéro de téléphone doit contenir exactement 10 chiffres.")]
    public string PhoneNumber { get; set; } = string.Empty;
}