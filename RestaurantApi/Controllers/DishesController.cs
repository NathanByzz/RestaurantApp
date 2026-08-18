using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.DTOs;
using RestaurantApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public DishesController(RestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDishes()
    {
        var dishes = await _context.Dishes
            .Where(d => d.IsAvailable)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Description,
                d.Price,
                d.ImageUrl,
                d.IsAvailable,
                d.RestaurantId,
                RestaurantName = d.Restaurant != null ? d.Restaurant.Name : null,
                d.CategoryId,
                CategoryName = d.Category != null ? d.Category.Name : null
            })
            .ToListAsync();

        return Ok(dishes);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDishById(int id)
    {
        var dish = await _context.Dishes
            .Where(d => d.Id == id)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Description,
                d.Price,
                d.ImageUrl,
                d.IsAvailable,
                d.RestaurantId,
                RestaurantName = d.Restaurant != null ? d.Restaurant.Name : null,
                d.CategoryId,
                CategoryName = d.Category != null ? d.Category.Name : null
            })
            .FirstOrDefaultAsync();

        if (dish == null)
        {
            return NotFound();
        }

        return Ok(dish);
    }

    [HttpGet("restaurant/{restaurantId:int}")]
    public async Task<IActionResult> GetDishesByRestaurant(int restaurantId)
    {
        var restaurantExists = await _context.Restaurants
            .AnyAsync(r => r.Id == restaurantId);

        if (!restaurantExists)
        {
            return NotFound(new { message = "Restaurant introuvable." });
        }

        var dishes = await _context.Dishes
            .Where(d => d.RestaurantId == restaurantId && d.IsAvailable)
            .Select(d => new
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
            .ToListAsync();

        return Ok(dishes);
    }
    [Authorize(Roles = "Restaurateur")]
    [HttpPost]
    public async Task<IActionResult> CreateDish(DishCreateDto dishDto)
    {
        var restaurantExists = await _context.Restaurants
            .AnyAsync(r => r.Id == dishDto.RestaurantId);

        if (!restaurantExists)
        {
            return BadRequest(new { message = "Le restaurant indiqué n'existe pas." });
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dishDto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest(new { message = "La catégorie indiquée n'existe pas." });
        }

        if (dishDto.Price <= 0)
        {
            return BadRequest(new { message = "Le prix du plat doit être supérieur à 0." });
        }

        var dish = new Dish
        {
            Name = dishDto.Name,
            Description = dishDto.Description,
            Price = dishDto.Price,
            ImageUrl = dishDto.ImageUrl,
            RestaurantId = dishDto.RestaurantId,
            CategoryId = dishDto.CategoryId,
            IsAvailable = true
        };

        _context.Dishes.Add(dish);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetDishById),
            new { id = dish.Id },
            new
            {
                dish.Id,
                dish.Name,
                dish.Description,
                dish.Price,
                dish.ImageUrl,
                dish.IsAvailable,
                dish.RestaurantId,
                dish.CategoryId
            }
        );
    }
    [Authorize(Roles = "Restaurateur")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDish(int id, DishCreateDto dishDto)
    {
        var dish = await _context.Dishes.FindAsync(id);

        if (dish == null)
        {
            return NotFound();
        }

        var restaurantExists = await _context.Restaurants
            .AnyAsync(r => r.Id == dishDto.RestaurantId);

        if (!restaurantExists)
        {
            return BadRequest(new { message = "Le restaurant indiqué n'existe pas." });
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dishDto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest(new { message = "La catégorie indiquée n'existe pas." });
        }

        if (dishDto.Price <= 0)
        {
            return BadRequest(new { message = "Le prix du plat doit être supérieur à 0." });
        }

        dish.Name = dishDto.Name;
        dish.Description = dishDto.Description;
        dish.Price = dishDto.Price;
        dish.ImageUrl = dishDto.ImageUrl;
        dish.RestaurantId = dishDto.RestaurantId;
        dish.CategoryId = dishDto.CategoryId;

        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    [Authorize(Roles = "Restaurateur")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDish(int id)
    {
        var dish = await _context.Dishes.FindAsync(id);

        if (dish == null)
        {
            return NotFound();
        }

        dish.IsAvailable = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}