using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.DTOs;
using RestaurantApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public OrdersController(RestaurantDbContext context)
    {
        _context = context;
    }
    
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Select(o => new
            {
                o.Id,
                o.CreatedAt,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.ClientId,
                ClientName = o.Client != null ? o.Client.FirstName + " " + o.Client.LastName : null,
                o.RestaurantId,
                RestaurantName = o.Restaurant != null ? o.Restaurant.Name : null,
                Items = o.Items.Select(i => new
                {
                    i.Id,
                    i.DishId,
                    DishName = !string.IsNullOrEmpty(i.DishName)
                        ? i.DishName
                        : i.Dish != null ? i.Dish.Name : null,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Where(o => o.Id == id)
            .Select(o => new
            {
                o.Id,
                o.CreatedAt,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.ClientId,
                ClientName = o.Client != null ? o.Client.FirstName + " " + o.Client.LastName : null,
                o.RestaurantId,
                RestaurantName = o.Restaurant != null ? o.Restaurant.Name : null,
                Items = o.Items.Select(i => new
                {
                    i.DishId,
                    DishName = !string.IsNullOrEmpty(i.DishName)
                        ? i.DishName
                        : i.Dish != null ? i.Dish.Name : null,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [Authorize]
    [HttpGet("client/{clientId:int}")]
    public async Task<IActionResult> GetOrdersByClient(int clientId)
    {
        var clientExists = await _context.Users
            .AnyAsync(u => u.Id == clientId && u.Role == "Client");

        if (!clientExists)
        {
            return NotFound(new { message = "Client introuvable." });
        }

        var orders = await _context.Orders
            .Where(o => o.ClientId == clientId)
            .Select(o => new
            {
                o.Id,
                o.CreatedAt,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.RestaurantId,
                RestaurantName = o.Restaurant != null ? o.Restaurant.Name : null,
                Items = o.Items.Select(i => new
                {
                    i.DishId,
                    DishName = !string.IsNullOrEmpty(i.DishName)
                        ? i.DishName
                        : i.Dish != null ? i.Dish.Name : null,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize]
    [HttpGet("restaurant/{restaurantId:int}")]
    public async Task<IActionResult> GetOrdersByRestaurant(int restaurantId)
    {
        var restaurantExists = await _context.Restaurants
            .AnyAsync(r => r.Id == restaurantId);

        if (!restaurantExists)
        {
            return NotFound(new { message = "Restaurant introuvable." });
        }

        var orders = await _context.Orders
            .Where(o => o.RestaurantId == restaurantId)
            .Select(o => new
            {
                o.Id,
                o.CreatedAt,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.ClientId,
                ClientName = o.Client != null ? o.Client.FirstName + " " + o.Client.LastName : null,
                Items = o.Items.Select(i => new
                {
                    i.DishId,
                    DishName = !string.IsNullOrEmpty(i.DishName)
                        ? i.DishName
                        : i.Dish != null ? i.Dish.Name : null,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Client")]
    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateDto orderDto)
    {
        var client = await _context.Users.FindAsync(orderDto.ClientId);

        if (client == null || client.Role != "Client")
        {
            return BadRequest(new { message = "Le client indiqué est invalide." });
        }

        var restaurantExists = await _context.Restaurants
            .AnyAsync(r => r.Id == orderDto.RestaurantId && r.IsActive);

        if (!restaurantExists)
        {
            return BadRequest(new { message = "Le restaurant indiqué est invalide." });
        }
        
        if (string.IsNullOrWhiteSpace(orderDto.DeliveryAddress))
        {
            return BadRequest(new
            {
                message = "L’adresse de livraison est obligatoire."
            });
        }

        if (orderDto.Items.Count == 0)
        {
            return BadRequest(new { message = "La commande doit contenir au moins un plat." });
        }

        var dishIds = orderDto.Items.Select(i => i.DishId).ToList();

        var dishes = await _context.Dishes
            .Where(d => dishIds.Contains(d.Id)
                        && d.RestaurantId == orderDto.RestaurantId
                        && d.IsAvailable)
            .ToListAsync();

        if (dishes.Count != dishIds.Distinct().Count())
        {
            return BadRequest(new { message = "Un ou plusieurs plats sont invalides pour ce restaurant." });
        }

        var order = new Order
        {
            ClientId = orderDto.ClientId,
            RestaurantId = orderDto.RestaurantId,
            DeliveryAddress = orderDto.DeliveryAddress,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        foreach (var itemDto in orderDto.Items)
        {
            if (itemDto.Quantity <= 0)
            {
                return BadRequest(new { message = "La quantité doit être supérieure à 0." });
            }

            var dish = dishes.First(d => d.Id == itemDto.DishId);

            var orderItem = new OrderItem
            {
                DishId = dish.Id,
                DishName = dish.Name,
                Quantity = itemDto.Quantity,
                UnitPrice = dish.Price
            };

            order.Items.Add(orderItem);
            order.TotalAmount += dish.Price * itemDto.Quantity;
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            new
            {
                order.Id,
                order.CreatedAt,
                order.Status,
                order.TotalAmount,
                order.DeliveryAddress,
                order.ClientId,
                order.RestaurantId,
                Items = order.Items.Select(i => new
                {
                    i.DishId,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            }
        );
    }

    [Authorize(Roles = "Livreur,Restaurateur")]
[HttpPut("{id:int}/status")]
public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
{
    var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

    var validStatuses = new[] { "Pending", "Preparing", "InDelivery", "Delivered", "Cancelled" };

    if (!validStatuses.Contains(status))
    {
        return BadRequest(new
        {
            message = "Statut invalide. Utilisez Pending, Preparing, InDelivery, Delivered ou Cancelled."
        });
    }

    var order = await _context.Orders.FindAsync(id);

    if (order == null)
    {
        return NotFound();
    }

    if (userRole == "Restaurateur")
    {
        if (order.Status == "InDelivery" || order.Status == "Delivered")
        {
            return BadRequest(new
            {
                message = "Le restaurateur ne peut plus modifier une commande déjà prise en livraison ou livrée."
            });
        }

        var restaurateurStatuses = new[] { "Pending", "Preparing", "Cancelled" };

        if (!restaurateurStatuses.Contains(status))
        {
            return Forbid();
        }
    }

    if (userRole == "Livreur")
    {
        if (order.Status == "Preparing" && status != "InDelivery")
        {
            return BadRequest(new
            {
                message = "Le livreur doit d'abord passer la commande en livraison."
            });
        }

        if (order.Status == "InDelivery" && status != "Delivered")
        {
            return BadRequest(new
            {
                message = "Une commande en livraison peut seulement être marquée comme livrée."
            });
        }

        if (order.Status != "Preparing" && order.Status != "InDelivery")
        {
            return BadRequest(new
            {
                message = "Le livreur peut seulement modifier une commande en préparation ou en livraison."
            });
        }

        var livreurStatuses = new[] { "InDelivery", "Delivered" };

        if (!livreurStatuses.Contains(status))
        {
            return Forbid();
        }
    }

    order.Status = status;

    await _context.SaveChangesAsync();

    return NoContent();
}
}