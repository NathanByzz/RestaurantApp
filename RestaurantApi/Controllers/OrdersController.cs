using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApi.Data;
using RestaurantApi.DTOs;
using RestaurantApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var query = _context.Orders.AsQueryable();

        if (userRole == "Livreur")
        {
            if (!int.TryParse(userIdClaim, out var livreurId))
            {
                return Unauthorized(new { message = "Identifiant utilisateur invalide." });
            }

            query = query.Where(o =>
                (o.Status == "Preparing" && o.DeliveryPersonId == null) ||
                (o.Status == "InDelivery" && o.DeliveryPersonId == livreurId)
            );
        }

        var orders = await query
            .Select(o => new
            {
                o.Id,
                o.CreatedAt,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,

                o.ClientId,
                ClientName = o.Client != null
                    ? o.Client.FirstName + " " + o.Client.LastName
                    : null,
                ClientPhoneNumber = o.Client != null
                    ? o.Client.PhoneNumber
                    : null,

                o.RestaurantId,
                RestaurantName = o.Restaurant != null
                    ? o.Restaurant.Name
                    : null,

                o.DeliveryPersonId,
                DeliveryPersonName = o.DeliveryPerson != null
                    ? o.DeliveryPerson.FirstName + " " + o.DeliveryPerson.LastName
                    : null,

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
                ClientName = o.Client != null
                    ? o.Client.FirstName + " " + o.Client.LastName
                    : null,
                ClientPhoneNumber = o.Client != null
                    ? o.Client.PhoneNumber
                    : null,

                o.RestaurantId,
                RestaurantName = o.Restaurant != null
                    ? o.Restaurant.Name
                    : null,

                o.DeliveryPersonId,
                DeliveryPersonName = o.DeliveryPerson != null
                    ? o.DeliveryPerson.FirstName + " " + o.DeliveryPerson.LastName
                    : null,

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

                o.ClientId,
                ClientName = o.Client != null
                    ? o.Client.FirstName + " " + o.Client.LastName
                    : null,
                ClientPhoneNumber = o.Client != null
                    ? o.Client.PhoneNumber
                    : null,

                o.RestaurantId,
                RestaurantName = o.Restaurant != null
                    ? o.Restaurant.Name
                    : null,

                o.DeliveryPersonId,
                DeliveryPersonName = o.DeliveryPerson != null
                    ? o.DeliveryPerson.FirstName + " " + o.DeliveryPerson.LastName
                    : null,

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
                ClientName = o.Client != null
                    ? o.Client.FirstName + " " + o.Client.LastName
                    : null,
                ClientPhoneNumber = o.Client != null
                    ? o.Client.PhoneNumber
                    : null,

                o.RestaurantId,
                RestaurantName = o.Restaurant != null
                    ? o.Restaurant.Name
                    : null,

                o.DeliveryPersonId,
                DeliveryPersonName = o.DeliveryPerson != null
                    ? o.DeliveryPerson.FirstName + " " + o.DeliveryPerson.LastName
                    : null,

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
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
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
            CreatedAt = DateTime.UtcNow,
            DeliveryPersonId = null
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
                ClientName = client.FirstName + " " + client.LastName,
                ClientPhoneNumber = client.PhoneNumber,

                order.RestaurantId,
                order.DeliveryPersonId,

                Items = order.Items.Select(i => new
                {
                    i.DishId,
                    DishName = i.DishName,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            }
        );
    }

    [Authorize(Roles = "Livreur")]
    [HttpPut("{id:int}/take")]
    public async Task<IActionResult> TakeOrder(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var livreurId))
        {
            return Unauthorized(new { message = "Identifiant livreur invalide." });
        }

        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound(new { message = "Commande introuvable." });
        }

        if (order.Status != "Preparing")
        {
            return BadRequest(new
            {
                message = "Seules les commandes en préparation peuvent être prises par un livreur."
            });
        }

        if (order.DeliveryPersonId != null)
        {
            return BadRequest(new
            {
                message = "Cette commande a déjà été prise par un autre livreur."
            });
        }

        order.DeliveryPersonId = livreurId;
        order.Status = "InDelivery";

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Commande prise en charge avec succès.",
            order.Id,
            order.Status,
            order.DeliveryPersonId
        });
    }

    [Authorize(Roles = "Livreur,Restaurateur")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var validStatuses = new[]
        {
            "Pending",
            "Preparing",
            "InDelivery",
            "Delivered",
            "Cancelled"
        };

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
            return NotFound(new { message = "Commande introuvable." });
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

            var restaurateurStatuses = new[]
            {
                "Pending",
                "Preparing",
                "Cancelled"
            };

            if (!restaurateurStatuses.Contains(status))
            {
                return Forbid();
            }

            order.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        if (userRole == "Livreur")
        {
            if (!int.TryParse(userIdClaim, out var livreurId))
            {
                return Unauthorized(new { message = "Identifiant livreur invalide." });
            }

            if (status == "InDelivery")
            {
                if (order.Status != "Preparing")
                {
                    return BadRequest(new
                    {
                        message = "Le livreur peut seulement prendre une commande en préparation."
                    });
                }

                if (order.DeliveryPersonId != null)
                {
                    return BadRequest(new
                    {
                        message = "Cette commande a déjà été prise par un autre livreur."
                    });
                }

                order.DeliveryPersonId = livreurId;
                order.Status = "InDelivery";

                await _context.SaveChangesAsync();

                return NoContent();
            }

            if (status == "Delivered")
            {
                if (order.Status != "InDelivery")
                {
                    return BadRequest(new
                    {
                        message = "Seule une commande en livraison peut être marquée comme livrée."
                    });
                }

                if (order.DeliveryPersonId != livreurId)
                {
                    return Forbid();
                }

                order.Status = "Delivered";

                await _context.SaveChangesAsync();

                return NoContent();
            }

            return Forbid();
        }

        return Forbid();
    }
}