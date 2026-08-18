using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.DTOs;
using RestaurantApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public RestaurantsController(RestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRestaurants()
    {
        var restaurants = await _context.Restaurants
            .Where(r => r.IsActive)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.Address,
                r.PhoneNumber,
                r.IsActive,
                r.OwnerId
            })
            .ToListAsync();

        return Ok(restaurants);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetRestaurantById(int id)
    {
        var restaurant = await _context.Restaurants
            .Where(r => r.Id == id)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.Address,
                r.PhoneNumber,
                r.IsActive,
                r.OwnerId,
                Dishes = r.Dishes.Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Description,
                    d.Price,
                    d.ImageUrl,
                    d.IsAvailable,
                    d.RestaurantId,
                    d.CategoryId,
                    CategoryName = d.Category != null ? d.Category.Name : null
                })
            })
            .FirstOrDefaultAsync();

        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant introuvable." });
        }

        return Ok(restaurant);
    }

    [Authorize(Roles = "Restaurateur")]
    [HttpPost]
    public async Task<ActionResult<Restaurant>> CreateRestaurant(RestaurantCreateDto restaurantDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var owner = await _context.Users.FindAsync(restaurantDto.OwnerId);

        if (owner == null)
        {
            return BadRequest(new { message = "Le propriétaire indiqué n'existe pas." });
        }

        if (owner.Role != "Restaurateur")
        {
            return BadRequest(new { message = "Seul un utilisateur avec le rôle Restaurateur peut créer un restaurant." });
        }

        var restaurant = new Restaurant
        {
            Name = restaurantDto.Name.Trim(),
            Description = restaurantDto.Description.Trim(),
            Address = restaurantDto.Address.Trim(),
            PhoneNumber = restaurantDto.PhoneNumber.Trim(),
            OwnerId = restaurantDto.OwnerId,
            IsActive = true
        };

        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetRestaurantById),
            new { id = restaurant.Id },
            new
            {
                restaurant.Id,
                restaurant.Name,
                restaurant.Description,
                restaurant.Address,
                restaurant.PhoneNumber,
                restaurant.IsActive,
                restaurant.OwnerId
            }
        );
    }

    [Authorize(Roles = "Restaurateur")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRestaurant(int id, RestaurantUpdateDto restaurantDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingRestaurant = await _context.Restaurants.FindAsync(id);

        if (existingRestaurant == null)
        {
            return NotFound(new { message = "Restaurant introuvable." });
        }

        existingRestaurant.Name = restaurantDto.Name.Trim();
        existingRestaurant.Description = restaurantDto.Description.Trim();
        existingRestaurant.Address = restaurantDto.Address.Trim();
        existingRestaurant.PhoneNumber = restaurantDto.PhoneNumber.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            existingRestaurant.Id,
            existingRestaurant.Name,
            existingRestaurant.Description,
            existingRestaurant.Address,
            existingRestaurant.PhoneNumber,
            existingRestaurant.IsActive,
            existingRestaurant.OwnerId
        });
    }

    [Authorize(Roles = "Restaurateur")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRestaurant(int id)
    {
        var restaurant = await _context.Restaurants.FindAsync(id);

        if (restaurant == null)
        {
            return NotFound(new { message = "Restaurant introuvable." });
        }

        restaurant.IsActive = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}