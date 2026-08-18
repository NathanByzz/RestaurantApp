using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.DTOs;
using RestaurantApi.Models;
using RestaurantApi.Services;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RestaurantApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(RestaurantDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (
            string.IsNullOrWhiteSpace(registerDto.FirstName) ||
            string.IsNullOrWhiteSpace(registerDto.LastName) ||
            string.IsNullOrWhiteSpace(registerDto.Email) ||
            string.IsNullOrWhiteSpace(registerDto.PhoneNumber) ||
            string.IsNullOrWhiteSpace(registerDto.Password) ||
            string.IsNullOrWhiteSpace(registerDto.Role)
        )
        {
            return BadRequest(new
            {
                message = "Tous les champs sont obligatoires."
            });
        }

        var emailRegex = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";

        if (!Regex.IsMatch(registerDto.Email, emailRegex))
        {
            return BadRequest(new
            {
                message = "Adresse email invalide."
            });
        }

        var phoneRegex = @"^\d{10}$";

        if (!Regex.IsMatch(registerDto.PhoneNumber, phoneRegex))
        {
            return BadRequest(new
            {
                message = "Le numéro de téléphone doit contenir exactement 10 chiffres."
            });
        }

        var passwordRegex = @"^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$";

        if (!Regex.IsMatch(registerDto.Password, passwordRegex))
        {
            return BadRequest(new
            {
                message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
            });
        }

        var validRoles = new[] { "Client", "Restaurateur", "Livreur" };

        if (!validRoles.Contains(registerDto.Role))
        {
            return BadRequest(new
            {
                message = "Rôle invalide. Utilisez Client, Restaurateur ou Livreur."
            });
        }

        var emailAlreadyExists = await _context.Users
            .AnyAsync(u => u.Email == registerDto.Email);

        if (emailAlreadyExists)
        {
            return BadRequest(new
            {
                message = "Cet email est déjà utilisé."
            });
        }

        var user = new User
        {
            FirstName = registerDto.FirstName.Trim(),
            LastName = registerDto.LastName.Trim(),
            Email = registerDto.Email.Trim(),
            PhoneNumber = registerDto.PhoneNumber.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = registerDto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Compte créé avec succès.",
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Role
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Email ou mot de passe invalide." });
        }

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);

        if (!passwordIsValid)
        {
            return Unauthorized(new { message = "Email ou mot de passe invalide." });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            message = "Connexion réussie.",
            token,
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Role
            }
        });
    }

    [Authorize]
    [HttpPut("update-phone")]
    public async Task<IActionResult> UpdatePhoneNumber(UpdatePhoneNumberDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            return Unauthorized(new { message = "Utilisateur non authentifié." });
        }

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Identifiant utilisateur invalide." });
        }

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound(new { message = "Utilisateur introuvable." });
        }

        var phoneRegex = @"^\d{10}$";

        if (!Regex.IsMatch(dto.PhoneNumber, phoneRegex))
        {
            return BadRequest(new
            {
                message = "Le numéro de téléphone doit contenir exactement 10 chiffres."
            });
        }

        user.PhoneNumber = dto.PhoneNumber.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Numéro de téléphone modifié avec succès.",
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Role
            }
        });
    }
}