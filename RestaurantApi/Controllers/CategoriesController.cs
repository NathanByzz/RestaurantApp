using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.Models;

namespace RestaurantApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public CategoriesController(RestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> GetCategoryById(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return category;
    }
}